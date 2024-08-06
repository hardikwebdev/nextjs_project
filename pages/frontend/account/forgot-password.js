import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, Form, FormGroup, Row } from 'react-bootstrap';
import Link from 'next/link';
import Header from '../header';
import { forgotPassword } from "@/shared/services/Front_Apis/auth/authCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from 'next/router';
import Seo from "@/shared/layout-components/seo/seo";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";

const initialValues = {
    email: '',
};


function ForgotPassPage() {
    const [generalConfigData, setGeneralConfigData] = useState();

    const navigate = useRouter();
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


    const Schema = Yup.object().shape({
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
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            document.getElementById("submitButton").disabled = true;
            forgotPassword(values.email)
                .then(({ data }) => {
                    toast.success(data?.message, {
                        theme: "dark",
                    });
                    setTimeout(() => {
                        let path = `/account/login`;
                        navigate.push(path);
                    }, 1000)
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

        },
    });

    return (
        <div className='h-100vh primaryThemeColor'>
            <Seo title={"Forgot password"} />
            <Header />
            <div className='d-flex justify-content-center align-items-center min_height_set min_height_set overflow-auto pt-5'>
                <Row className="my-4 mb-md-2 mt-md-0 mx-0 justify-content-center w-100 h-100 align-items-center pt-3">
                    <Col lg={5} xl={5} md={10} sm={10} className='p-0 px-md-3'>
                        <div className='mb-4'>
                            <header className='mb-5'>
                                <h3 className="text-uppercase text-center mb-1 tx-md-35 tx-sm-28">
                                    forgot password?
                                </h3>
                                <p className='tx-16 text-center m-0'>No worries, we'll send you reset instructions</p>
                            </header>
                        </div>
                        <Card className="box-shadow-0 shadow-none bg-transparent mb-0">
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

                                    <FormGroup className="form-group mb-0 mt-3 pt-2 justify-content-end">
                                        <div>
                                            <Button variant="" id="submitButton" type="submit" className="btn btn-primary w-100 tx-medium">
                                                Reset Password
                                            </Button>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="form-group mb-0 justify-content-end mt-3">
                                        <div className="text-center tx-medium tx-20">
                                            <Link href="/account/login">Back to Log in</Link>
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

export default ForgotPassPage;
