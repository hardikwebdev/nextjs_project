import React, { useEffect, useState } from 'react';
import { Form, Row, Col, FormGroup, Button, Alert } from 'react-bootstrap';
import { useAcceptJs } from 'react-acceptjs';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sendSubscription } from '@/shared/services/Front_Apis/account/subscriptions/subscriptionsCrud';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { sendTip } from '@/shared/services/Front_Apis/tipPage/tipPageCrud';

const authData = {
    apiLoginID: process.env.NEXT_PUBLIC_LOGIN_ID,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
};

const SubscriptionGateway = ({ fromPage, closeModal, product_id, name, email, message, amount, user_id }) => {
    const { dispatchData, loading, error } = useAcceptJs({ authData });
    const [errorMessage, setErrorMessage] = useState('')
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);

    const initialValues = {
        cardNumber: "",
        expirationDate: null,
        cardCode: ''
    };


    useEffect(() => {
        if (errorMessage !== '') {
            setTimeout(() => {
                setErrorMessage('')
            }, 3000);

        }
    }, [errorMessage])

    const Schema = Yup.object().shape({
        cardNumber: Yup.string()
            .required('Card number is required')
            .matches(/^\d{13,16}$/, 'Card number must be between 13 and 16 digits'),

        expirationDate: Yup.date().required('Expiry date is required'),

        cardCode: Yup.string()
            .required('Card code is required')
            .matches(/^\d{3}$/, 'Card code must be 3 digits'),
    });


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            console.log('formik');
            const month = values.expirationDate ? String(values.expirationDate.getMonth() + 1).padStart(2, '0') : '';
            const year = values.expirationDate ? String(values.expirationDate.getFullYear()) : '';

            const dataToSend = {
                cardNumber: values.cardNumber,
                cardCode: values.cardCode,
                month: month,
                year: year,
            };

            handleSubmit(dataToSend);
        }
    });

    const handleSubmit = async (event) => {
        if (fromPage == 'tip') {
            console.log('fromPage', fromPage);
            try {
                const response = await dispatchData({ cardData: event });
                console.log('Received response:', response);
                if (response) {
                    sendTip(name, email, amount, message, response.opaqueData.dataValue, user_id)
                        .then(({ data }) => {
                            console.log("data", data);
                            toast.success(data?.message, {
                                theme: "dark",
                            });
                        })
                        .catch((error) => {
                            console.log('error', error);
                            toast.error(error?.response?.data?.message, {
                                theme: "dark",
                            });
                            toast.error(error?.response?.data?.description, {
                                theme: "dark"
                            });
                        })
                        .finally(() => {

                            closeModal();
                        });
                }
            } catch (error) {
                const errorMessage = error?.messages?.message[0]?.text;
                setErrorMessage(errorMessage);
            }

        }
        else {
            try {
                const response = await dispatchData({ cardData: event });
                console.log('Received response:', response);
                if (response) {
                    sendSubscription(
                        accessToken,
                        response.opaqueData.dataValue,
                        product_id,
                    )
                        .then(({ data }) => {
                            toast.success(data?.message, {
                                theme: "dark",
                            });

                        })
                        .catch((error) => {
                            console.log('error', error);
                            toast.error(error?.response?.data?.message, {
                                theme: "dark",
                            });
                            toast.error(error?.response?.data?.description, {
                                theme: "dark"
                            });
                        })
                        .finally(() => {

                            closeModal();
                        });
                }
            } catch (error) {
                const errorMessage = error?.messages?.message[0]?.text;
                setErrorMessage(errorMessage);
            }
        }
    };



    return (
        <div>
            <Form onSubmit={formik.handleSubmit}
            >
                <Row>
                    <Col lg={12}>
                        <FormGroup>
                            <Form.Label className="form-label text-dark mt-0">
                                Card Number
                            </Form.Label>
                            <Form.Control
                                className="form-control"
                                placeholder="Card Number"
                                type="text"
                                name="cardNumber"
                                value={formik.values.cardNumber}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                                maxLength={16}
                            />
                            {formik.errors.cardNumber && formik.touched.cardNumber && (
                                <div className="text-danger">
                                    {formik.errors.cardNumber}
                                </div>
                            )}
                        </FormGroup>
                    </Col>


                    <Col sm={6}>
                        <FormGroup>
                            <Form.Label className="form-label text-dark">Expiry Date</Form.Label>
                            <DatePicker
                                selected={formik.values.expirationDate || null}
                                onChange={(date) => formik.setFieldValue('expirationDate', date)}
                                placeholderText='MM/YYYY'
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                minDate={new Date()}
                                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 10))}
                                className="form-control"
                            />
                            {formik.errors.expirationDate && formik.touched.expirationDate && (
                                <div className="text-danger">{formik.errors.expirationDate}</div>
                            )}
                        </FormGroup>
                    </Col>

                    <Col sm={6}>
                        <FormGroup>
                            <Form.Label className="form-label text-dark">
                                Card Code
                            </Form.Label>
                            <Form.Control
                                className="form-control"
                                placeholder="Card Code"
                                type="text"
                                name="cardCode"
                                value={formik.values.cardCode}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                                maxLength={3}

                            />
                            {formik.errors.cardCode && formik.touched.cardCode && (
                                <div className="text-danger">
                                    {formik.errors.cardCode}
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                    {errorMessage &&
                        <Col>
                            <Alert
                                className={`alert mb-2 alert-danger mt-3`}
                                variant=""
                            >
                                <Alert.Heading className='mb-0'>
                                    <h6 className="alert-heading mb-0">
                                        <i className="fe fe-alert-octagon me-2 tx-16"></i>
                                        {errorMessage}
                                    </h6>
                                </Alert.Heading>
                            </Alert>
                        </Col>
                    }
                    <Col lg={12} className='mt-3'>
                        <Button type="submit" disabled={loading || error} className='w-100'>
                            {loading ? 'Processing...' : 'Pay'}
                        </Button>
                    </Col>
                </Row>
            </Form>
            <ToastContainer />
        </div>
    );
};



export default SubscriptionGateway;
