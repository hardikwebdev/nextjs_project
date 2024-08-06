import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, Form, FormGroup, Row, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Header from '../header';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { logIn } from "@/shared/services/Front_Apis/auth/authCrud";
import ReCAPTCHA from "react-google-recaptcha";
import { setFrontEndUserData } from "@/shared/redux/actions/authAction";
import { useDispatch, useSelector } from 'react-redux'; // Import the useDispatch hook
import Seo from "@/shared/layout-components/seo/seo";
import { setSyncAllSavedBlogsData } from '@/shared/services/Front_Apis/account/accountCrud';
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";

const initialValues = {
    email: '',
    password: '',
    captcha_token: '',
};

function LoginPage() {
    const [syncBookmark, setSyncBookmarks] = useState([])
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [generalConfigData, setGeneralConfigData] = useState();
    const [remember, setRemember] = useState(false)

    const grecaptchaObject = window.grecaptcha;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const navigate = useRouter();
    const dispatch = useDispatch(); // Get the dispatch function
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const bookmarkData = useSelector((state) => state?.bookmarkData);
    const user_id = useSelector((state) => state?.frontEndUserData?.userData?.id);
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;


    useEffect(() => {
        if (user_id) {
            console.log("user_id******", user_id);
            const userBookmarks = bookmarkData?.map((data) => ({
                user_id: user_id,
                blog_id: data?.blog_id || (data?.blogposts?.id ? data.blogposts.id : null),
                bookmarked: data?.bookmarked || (data?.blogposts?.bookmarked ? data.blogposts.bookmarked : null),
            }));
            setSyncBookmarks(userBookmarks);
        }
    }, [user_id]);

    const getGeneralConfigData = () => {
        getGeneralConfig()
            .then(({ data }) => {
                setGeneralConfigData(data)
                dispatch(setGeneralConfigs(data));
            })
            .catch((error) => {
                console.log(error);

            })
    }

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          .primaryThemeColor {
              background-color: ${primaryThemeColor};
              
            }
            .secondaryThemeColor{
              background-color: ${secondaryThemeColor};
            }
            .secondaryButtonColor{
              background-color: ${secondaryButtonsColor};
            }
            .primaryButtonColor{
              background-color: ${primaryButtonsColor};
            }
            .FontColor{
                color: ${fontColor};
              }
          `;
        document.head.appendChild(style);

        if (generalConfigData?.blog_toggle === 0) {
            let path = `/`;
            navigate.push(path);
        }
    }, [generalConfigData]);

    useEffect(() => {
        getGeneralConfigData();
    }, [])

    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleRememberChange = (e) => {
        setRemember(e.target.checked);
    };


    const setBookmarkData = () => {
        if (syncBookmark?.length > 0) {
            setSyncAllSavedBlogsData(accessToken, syncBookmark)
                .then(({ data }) => {
                    console.log(data);
                    let path = `/`;
                    navigate.push(path);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    };
    useEffect(() => {
        setBookmarkData()
    }, [syncBookmark])

    console.log("syncBookmark", syncBookmark);

    const captchaRef = useRef(null);
    const Schema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format') // Validate email format
            .required('Email is required'),

        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                "New Password must include at least 1 uppercase letter and 1 special character"
            ),
        captcha_token: Yup.string().required("You must verify the captcha"),

    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            setLoading(true);


            logIn(values.email, values.password, values.captcha_token, remember)
                .then(({ data }) => {
                    toast.success(data?.message, {
                        theme: "dark",
                    });
                    if (syncBookmark.length === 0) {
                        setTimeout(() => {
                            let path = `/`;
                            navigate.push(path);
                        }, 1500)
                    }
                    dispatch(setFrontEndUserData(data));

                    document.getElementById("submitButton").disabled = true;
                })
                .catch((error) => {
                    if (error?.response?.data?.description) {
                        toast.error(error?.response?.data?.description, {
                            theme: "dark",
                        });
                    } else {
                        toast.error(error?.response?.data?.message, {
                            theme: "dark",
                        });
                    }
                    window.grecaptcha.reset();
                })
                .finally(() => {
                    setSubmitting(false);
                    setRemember(false);
                    formik.resetForm();
                    setLoading(false);
                    window.grecaptcha.reset();
                });
        },


    });

    return (
        <div className='h-100vh primaryThemeColor'>
            <Seo title={"Login"} />
            <Header />
            <div className='d-flex justify-content-center align-items-center min_height_set min_height_set overflow-auto pt-5'>
                <Row className="my-4 mb-md-2 mt-md-0 mx-0 justify-content-center w-100 h-100 align-items-center">
                    <Col lg={5} xl={5} md={10} sm={10} className='p-0 px-md-3 pt-2'>
                        <div className='mb-5'>
                            <header>
                                <h3 className="text-uppercase text-center mb-4 tx-md-35 tx-sm-28">
                                    welcome to {generalConfigData?.site_name}
                                </h3>
                            </header>
                        </div>
                        <Card className="box-shadow-0 shadow-none bg-transparent mb-0 pt-4">
                            <Card.Body className="py-0">
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    formik.handleSubmit();
                                }} className="form-horizontal">
                                    <FormGroup className="form-group">
                                        <Form.Control
                                            className="form-control"
                                            placeholder="Email"
                                            type="text"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.email && formik.touched.email && (
                                            <div className="text-danger">{formik.errors.email}</div>
                                        )}
                                    </FormGroup>
                                    <FormGroup className="form-group position-relative">
                                        <Form.Control
                                            type={passwordVisible ? 'text' : 'password'}
                                            className="form-control"
                                            id="inputPassword"
                                            placeholder="Password"
                                            name="password"
                                            autoComplete="off"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="text-danger">{formik.errors.password}</div>
                                        )}
                                        <span
                                            className="position-absolute pass_seen cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? (
                                                <i className="far fa-eye-slash"></i>
                                            ) : (
                                                <i className="far fa-eye"></i>
                                            )}
                                        </span>
                                    </FormGroup>
                                    <FormGroup className="form-group mb-0 justify-content-end log_check">
                                        <div className="checkbox">
                                            <Row className="m-0">
                                                <Col xl={12} lg={12} md={12} sm={12} className='p-0 my-1'>
                                                    <div className="custom-checkbox custom-control">
                                                        <Form.Control
                                                            type="checkbox"
                                                            data-checkboxes="mygroup"
                                                            className="custom-control-input"
                                                            id="checkbox-2"
                                                            checked={remember}
                                                            onChange={handleRememberChange}
                                                        />
                                                        <Form.Label
                                                            htmlFor="checkbox-2"
                                                            className="custom-control-label m-0 tx-16"
                                                        >
                                                            Remember me
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="form-group mb-0 justify-content-end mt-2">
                                        <div className="pb-20px">
                                            <ReCAPTCHA
                                                ref={captchaRef}
                                                name="captcha_token"
                                                sitekey={siteKey}
                                                onChange={(captcha_token) =>
                                                    formik.setFieldValue("captcha_token", captcha_token)
                                                }
                                                onReset={() => formik.setFieldValue("captcha_token", "")}
                                                onExpired={() => formik.setFieldValue("captcha_token", "")}
                                                grecaptcha={grecaptchaObject}
                                                className="captcha-shadow"
                                            />

                                            {formik.touched.captcha_token && formik.errors.captcha_token ? (
                                                <div className="fv-plugins-message-container">
                                                    <div className="fv-help-block text-danger">
                                                        {formik.errors.captcha_token}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </FormGroup>
                                    <FormGroup className="form-group mb-0 mt-3 pt-2 justify-content-end">
                                        <div>
                                            <Button variant="" type="submit" id="submitButton" className="btn btn-primary w-100 tx-medium">
                                                {loading ?
                                                    <Spinner animation="border"
                                                        className="spinner-border spinner-border-sm ms-3"
                                                        role="status"
                                                    >
                                                        <span className="sr-only">Loading...</span>
                                                    </Spinner>
                                                    : "Log in"}

                                            </Button>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="form-group justify-content-end mt-3 mb-4">
                                        <div className="forgot_link text-center tx-14">
                                            <Link href="/account/forgot-password">Forgot Password?</Link>
                                        </div>
                                    </FormGroup>
                                    <div className='break_line mt-3'>
                                        <hr></hr>
                                    </div>

                                    <FormGroup className="form-group mb-0 justify-content-end mt-2">
                                        <div className="text-center">
                                            <p className='tx-14 m-0'>Don't have an account?</p>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="form-group mb-0 justify-content-end mt-2">
                                        <div className="text-center text-uppercase tx-medium tx-20">
                                            <Link href="/account/sign-up">sign up</Link>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;
