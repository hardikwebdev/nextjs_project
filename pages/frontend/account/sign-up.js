import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, Form, FormGroup, Row, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import Header from '../header';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router'
import { signUp } from "@/shared/services/Front_Apis/auth/authCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import Seo from "@/shared/layout-components/seo/seo";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";

const initialValues = {
    FirstName: '',
    LastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha_token: '',
    // agreeToTerms: false,
};


function SignUpPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [generalConfigData, setGeneralConfigData] = useState();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch(); // Get the dispatch function
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;

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

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const grecaptchaObject = window.grecaptcha;
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const captchaRef = useRef(null);

    const Schema = Yup.object().shape({
        FirstName: Yup.string()
            .trim()
            .required('First name is required')
            .test('no-empty-spaces', 'First name must contain non-space characters', (value) => {
                return /\S/.test(value);
            }),
        LastName: Yup.string()
            .trim()
            .required('Last name is required')
            .test('no-empty-spaces', 'Last name must contain non-space characters', (value) => {
                return /\S/.test(value);
            }),
        email: Yup.string()
            .email('Please enter valid email id.') // Validate email format
            .required('Email is required')
            .test('valid-extension', 'Please enter valid email id.', (value) => {
                if (value) {
                    const emailParts = value.split('@');
                    if (emailParts.length === 2) {
                        const domainParts = emailParts[1].split('.');
                        return domainParts.length > 1;
                    }
                }
                return false;
            }),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                "Password must include at least 1 uppercase letter and 1 special character"
            ),
        confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Password must match"),

        // agreeToTerms: Yup.bool() // Validation for the checkbox
        //     .oneOf([true], 'You must agree to the Terms and Privacy'),
        captcha_token: Yup.string().required("You must verify the captcha"),

    });
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            console.log("in");
            setLoading(true);
            signUp(values.FirstName, values.LastName, values.email, values.confirmPassword, values.captcha_token)
                .then(({ data }) => {
                    toast.success(data?.message, {
                        theme: "dark",
                    });
                    let path = `/account/login`;
                    router.push(path);
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
                })
                .finally(() => {
                    setSubmitting(false);
                    captchaRef.current.reset();
                    formik.resetForm();
                    setLoading(false)
                });

        },
    });


    return (
        <div className='h-100vh primaryThemeColor'>
            <Header />
            <Seo title={"SignUp"} />



            <div className='d-flex justify-content-center align-items-center min_height_set min_height_set overflow-auto pt-5'>
                <Row className="my-4 mb-md-2 mt-md-0 mx-0 justify-content-center w-100 h-100 align-items-center">
                    <Col lg={5} xl={5} md={10} sm={10} className='p-0 px-md-3 creat_account'>
                        <div className='mb-4'>
                            <header>
                                <h3 className="text-uppercase text-center mb-4 tx-md-35 tx-sm-28">
                                    create an account
                                </h3>
                            </header>
                        </div>
                        <Card className="box-shadow-0 shadow-none bg-transparent mb-0 pt-5">
                            <Card.Body className="py-0">
                                <Form onSubmit={(e) => {
                                    e.preventDefault(); // Prevent the default form submission
                                    formik.handleSubmit(); // Trigger form submission
                                }}
                                    className="form-horizontal">
                                    <FormGroup className="form-group">
                                        <Form.Control
                                            className="form-control"
                                            placeholder="First Name"
                                            type="text"
                                            name="FirstName"
                                            value={formik.values.FirstName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.FirstName && formik.touched.FirstName && (
                                            <div className="text-danger">{formik.errors.FirstName}</div>
                                        )}
                                    </FormGroup>

                                    <FormGroup className="form-group">
                                        <Form.Control
                                            className="form-control"
                                            placeholder="Last Name"
                                            type="text"
                                            name="LastName"
                                            value={formik.values.LastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.LastName && formik.touched.LastName && (
                                            <div className="text-danger">{formik.errors.LastName}</div>
                                        )}
                                    </FormGroup>

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
                                            // value={formik.values.password}
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

                                    <FormGroup className="form-group position-relative">
                                        <Form.Control
                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                            className="form-control"
                                            id="inputPassword3"
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            autoComplete="off"
                                            // value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <div className="text-danger">{formik.errors.confirmPassword}</div>
                                        )}
                                        <span
                                            className="position-absolute pass_seen cursor-pointer"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {confirmPasswordVisible ? (
                                                <i className="far fa-eye-slash"></i>
                                            ) : (
                                                <i className="far fa-eye"></i>
                                            )}
                                        </span>
                                    </FormGroup>
                                    {/* <FormGroup className="form-group mb-0 justify-content-end log_check">
                                        <div className="checkbox">
                                            <Row className="m-0">
                                                <Col xl={12} lg={12} md={12} sm={12} className='p-0 my-1'>
                                                    <div className="d-inline-block custom-checkbox custom-control">
                                                        <Form.Control
                                                            type="checkbox"
                                                            data-checkboxes="mygroup"
                                                            className="custom-control-input"
                                                            id="checkbox-2"
                                                            name="agreeToTerms" // Name should match the field in initialValues
                                                            checked={formik.values.agreeToTerms}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        <Form.Label
                                                            htmlFor="checkbox-2"
                                                            className="custom-control-label m-0 tx-16"
                                                        >
                                                            I agree with Terms and Privacy
                                                        </Form.Label>
                                                    </div>
                                                    {formik.errors.agreeToTerms && formik.touched.agreeToTerms && (
                                                        <div className="text-danger">{formik.errors.agreeToTerms}</div>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    </FormGroup> */}

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

                                    <FormGroup className="form-group mb-0 mt-3 justify-content-end mt-3">
                                        <div>
                                            <Button variant="" type="submit" id="submitButton" className="btn btn-primary w-100 tx-medium">

                                                {loading ?
                                                    <Spinner animation="border"
                                                        className="spinner-border spinner-border-sm ms-3"
                                                        role="status"
                                                    >
                                                        <span className="sr-only">Loading...</span>
                                                    </Spinner>
                                                    : "Sign up"}
                                            </Button>
                                        </div>
                                    </FormGroup>

                                    <div className='break_line mt-3'>
                                        <hr></hr>
                                    </div>

                                    <FormGroup className="form-group mb-0 justify-content-end mt-2">
                                        <div className="text-center">
                                            <p className='tx-14'>Already have an account?</p>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="form-group mb-0 justify-content-end mt-2">
                                        <div className="text-center text-uppercase tx-medium tx-18">
                                            <Link href="/account/login">Log in</Link>
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

export default SignUpPage;
