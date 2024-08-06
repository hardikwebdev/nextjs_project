import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Card, Row, Button } from 'react-bootstrap';
import { acceptInvitation, verifyUser, resetPassword } from "@/shared/services/Front_Apis/auth/authCrud";
import Header from '../header';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";

const initialValues = {
    password: '',
    confirmPassword: '',
};

function setPassword() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [verificationData, setVerificationData] = useState("")
    const [generalConfigData, setGeneralConfigData] = useState();

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


    let navigate = useRouter();
    const router = useRouter();
    const token =
        router?.query.invitationToken
            ? router.query.invitationToken
            : router?.query.verificationToken
                ? router.query.verificationToken
                : router.query.resetToken;

    useEffect(() => {
        setVerificationData(JSON.stringify(router?.query))
        localStorage.setItem('verificationData', JSON.stringify(router?.query));
    }, [])
    useEffect(() => {
        const storedVerificationData = localStorage.getItem('verificationData');
        if (typeof storedVerificationData === 'string' && storedVerificationData.startsWith('{') && storedVerificationData.endsWith('}')) {
            const parsedData = JSON.parse(storedVerificationData);
            setVerificationData(parsedData);
        }
    }, []);

    useEffect(() => {
        if (typeof verificationData === 'object') {
            localStorage.setItem('verificationData', JSON.stringify(verificationData));
        }
    }, [verificationData]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };
    const Schema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                "New Password must include at least 1 uppercase letter and 1 special character"
            ),
        confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Password must match"),


    });

    useEffect(() => {
        if (router?.query?.verificationToken) {
            verifyUser(token)
                .then(({ data }) => {
                    toast.success(data?.message, {
                        theme: "dark",
                    });
                    setTimeout(() => {
                        let path = `/`;
                        navigate.push(path);
                    }, 3000)
                })
                .catch((error) => {
                    if (error?.response?.data?.description) {
                        toast.error(error?.response?.data?.description, {
                            theme: "dark",
                        });
                        setTimeout(() => {
                            let path = `/`;
                            navigate.push(path);
                        }, 1000)
                    } else {
                        toast.error(error?.response?.data?.message, {
                            theme: "dark",
                        });
                        setTimeout(() => {
                            let path = `/`;
                            navigate.push(path);
                        }, 1000)
                    }
                })
        }
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }, [])

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            if (router?.query.invitationToken) {
                acceptInvitation(token, values.confirmPassword)
                    .then(({ data }) => {
                        toast.success(data?.message, {
                            theme: "dark",
                        });
                        let path = `/account/login`;
                        navigate.push(path);
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
                        formik.resetForm();
                    });
            }
            else {
                resetPassword(token, values.confirmPassword)
                    .then(({ data }) => {
                        toast.success(data?.message, {
                            theme: "dark",
                        });
                        setTimeout(() => {
                            let path = `/account/login`;
                            navigate.push(path);
                        }, 1500)
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
                        formik.resetForm();
                    });
            }

        },
    });


    return (
        <div className='h-100vh primaryThemeColor'>
            <Header />


            {router?.query?.verificationToken ?
                <>
                    <div className='loader_spinner'>
                        <div className="custom-card loader_spinner" id="loaders5">
                            <div className="text-center">
                                <div className="lds-spinner">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div className='d-flex justify-content-center align-items-center min_height_set min_height_set overflow-auto pt-5'>
                    <Row className="my-4 mb-md-2 mt-md-0 mx-0 justify-content-center w-100 h-100 align-items-center">
                        <Col lg={5} xl={4} md={10} sm={10} className='p-0 px-md-3 creat_account'>
                            <div className='mb-4'>
                                <header>
                                    <h3 className="text-uppercase text-center tx-md-35 tx-sm-28">
                                        set password
                                    </h3>
                                </header>
                            </div>
                            <Card className="box-shadow-0 shadow-none bg-transparent mb-0 pt-5">
                                <Card.Body className="py-0">
                                    <Form onSubmit={(e) => {
                                        e.preventDefault();
                                        formik.handleSubmit();
                                    }}
                                        className="form-horizontal">

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
                                                className="position-absolute pass_seen"
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
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                <div className="text-danger">{formik.errors.confirmPassword}</div>
                                            )}
                                            <span
                                                className="position-absolute pass_seen"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {confirmPasswordVisible ? (
                                                    <i className="far fa-eye-slash"></i>
                                                ) : (
                                                    <i className="far fa-eye"></i>
                                                )}
                                            </span>
                                        </FormGroup>

                                        <FormGroup className="form-group mb-0 mt-3 justify-content-end mt-3">
                                            <div>
                                                <Button type="submit" className="btn btn-primary w-100 tx-medium">
                                                    Set Password
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            }
            <ToastContainer />
        </div >
    );
}

export default setPassword;
