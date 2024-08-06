import React, { useEffect } from 'react';
import Seo from "@/shared/layout-components/seo/seo";
import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Modal, Button } from 'react-bootstrap';
import Header from '../header'
import Footer from '../footer'
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { getTipPage } from '@/shared/services/Front_Apis/tipPage/tipPageCrud';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import SubscriptionGateway from '@/pages/subscriptionGateway.js';

function TipPage() {
    const [generalConfigData, setGeneralConfigData] = useState();
    const [tipBlockData, setTipBlockData] = useState("");
    const [tipHeaderData, setTipHeaderData] = useState("");
    const [showModal, setShowModal] = useState(false);

    let navigate = useRouter();
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;

    const getGeneralConfigData = () => {
        getGeneralConfig()
            .then(({ data }) => {
                setGeneralConfigData(data)
            })
            .catch((error) => {
                console.log(error);

            })
    }
    const getTipsData = () => {
        getTipPage()
            .then(({ data }) => {
                setTipBlockData(data?.tipBlockData)
                setTipHeaderData(data?.tipBlockHeaderData)
            })
            .catch((error) => {
                console.log(error);

            })
    }

    useEffect(() => {
        if (generalConfigData?.tip_toggle === 0) {
            let path = `/`;
            navigate.push(path);
        }
    }, [generalConfigData]);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
        .font-color{
            color: ${fontColor} !important;
          }
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
          `;
        document.head.appendChild(style);
    }, [generalConfigData]);

    useEffect(() => {
        getGeneralConfigData();
        getTipsData();
    }, [])



    const dynamicStyles = tipHeaderData?.media
        ? {
            backgroundImage: `url(${tipHeaderData?.media})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }
        : {
            backgroundColor: primaryThemeColor,
        };

    const userData = useSelector((state) => state?.frontEndUserData);

    const initialValues = {
        Name: userData ? userData.userData?.first_name : '',
        email: userData ? userData?.userData?.email : '',
        MessageText: '',
        Tip: '',
    };


    const schema = Yup.object().shape({
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
        Name: Yup.string()
            .required("Name is required")
            .test(
                "no-leading-trailing-spaces",
                "Name cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        MessageText: Yup.string()
            .required("Message is required")
            .test(
                "no-leading-trailing-spaces",
                "Message cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        Tip: Yup.number().required("Tip is required").typeError("Tip must be a number").min(0, "Tip must be greater than or equal to 0"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: schema,
    });

    const modalOpen = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false);
        formik.resetForm({
            values: initialValues, 
         });
    };

    // useEffect(() => {
    //     if (!access_token) {
    //         let path = `/account/login`;
    //         navigate.push(path);
    //     }
    // }, [access_token])



    return (

        <div className='news_listing2 page'>
            <Seo title={"Tip"} />
            <div>
                <Header />

                {tipHeaderData !== null &&


                    <div className='news_head_text ' style={dynamicStyles}>

                        <Container>
                            <Row>
                                <Col>
                                    <div className={` m-auto py-md-5 my-xl-3 py-3 ${tipHeaderData?.text_button_alignment === "left" ? "text-start" : tipHeaderData?.text_button_alignment === "right" ? 'text-end' : 'text-center'}`}>
                                        <p className={` tx-24 tx-lg-35 tx-xl-42 ${tipHeaderData?.media ? 'text-white' : 'font-color'}  ln_1_2 tx-normal mt-3 pt-1 text-capitalize`}>{tipHeaderData?.header_text} </p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                }
            </div>
            {tipBlockData !== null &&

                <div className='flex-1 secondaryThemeColor collborator float-left w-100'>
                    <Container fluid>
                        <Row>
                            <Col sm={12} md={12} lg={5} className=' ps-lg-0 pt-4 pt-lg-0 text-center'>
                                <img
                                    src={tipBlockData?.media}
                                    className="float-none float-lg-right"
                                    alt="collaborate"
                                />
                            </Col>

                            <Col sm={12} md={12} lg={7} className='pb-4 pb-lg-0 mt-4 mt-lg-0 ps-2'>
                                <div className='d-flex align-items-center justify-content-center h-100 collab_data_text'>
                                    <div className='blue-white collab_data py-3'>
                                        <h2>{tipBlockData?.header_text}</h2>
                                        <span className='tx-17 tx-normal  font-color'>{tipBlockData?.sub_text}</span>

                                        <Row className='collaborate_form my-3'>
                                            <Col sm={12} md={12} lg={12}>
                                                
                                                <Form onSubmit={formik.handleSubmit}>
                                                    <Row>
                                                        
                                                        <Col sm={12} md={12} lg={6}>
                                                            <Form.Control
                                                                className="form-control"
                                                                placeholder="Name"
                                                                type="text"
                                                                name="Name"
                                                                value={formik.values.Name}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                            {formik.touched.Name && formik.errors.Name && (
                                                                <div className="text-danger">{formik.errors.Name}</div>
                                                            )}
                                                        </Col>
                                                        
                                                        <Col sm={12} md={12} lg={6} className="mt-3 mt-lg-0">
                                                            <Form.Group className="form-group">
                                                                {userData?.access_token ?
                                                                    <Form.Control
                                                                        className="form-control"
                                                                        placeholder="Enter your email"
                                                                        type="text"
                                                                        name="email"
                                                                        value={formik.values.email}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        disabled
                                                                    />
                                                                    :
                                                                    <Form.Control
                                                                        className="form-control"
                                                                        placeholder="Enter your email"
                                                                        type="text"
                                                                        name="email"
                                                                        value={formik.values.email}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                }
                                                                {formik.errors.email && formik.touched.email && (
                                                                    <div className="text-danger">{formik.errors.email}</div>
                                                                )}
                                                            </Form.Group>
                                                        </Col>

                                                        <Col sm={12} md={12} lg={12}>
                                                            <div className="TipMessageTextarea">
                                                                <textarea className="form-control" placeholder="Message" id="floatingTextarea" name="MessageText"
                                                                    value={formik.values.MessageText}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur} />
                                                                {formik.errors.MessageText && formik.touched.MessageText && (
                                                                    <div className="text-danger">{formik.errors.MessageText}</div>
                                                                )}
                                                                <label htmlFor="floatingTextarea"></label>
                                                            </div>
                                                        </Col>

                                                        <Col sm={12} md={12} className="mt-3 mt-lg-0">
                                                            <div className='d-flex flex-wrap'>
                                                                <Form.Label className='me-3 font-color tx-17'>
                                                                    Enter amount
                                                                </Form.Label>
                                                                <Form.Group className="form-group TipAmountInput">
                                                                    <Form.Control
                                                                        className="form-control br-6 "
                                                                        placeholder="$"
                                                                        type="number"
                                                                        name="Tip"
                                                                        value={formik.values.Tip}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        min={1}
                                                                    />
                                                                    {formik.errors.Tip && formik.touched.Tip && (
                                                                        <div className="text-danger">{formik.errors.Tip}</div>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <div>
                                                        <p className='tx-17 my-3 tx-normal required_text font-color'>*All fields are required</p>
                                                    </div>

                                                    <Button variant="" id="submitButton" className={`btn primaryButtonColor font-color tx-18`}  onClick={modalOpen}>
                                                        <span>Submit</span>
                                                    </Button>

                                                    <Modal show={showModal} onHide={() => setShowModal(false)} size="md" className="previewModalFulll">
                                                        <Modal.Header>
                                                            <Modal.Title>
                                                                Tip
                                                            </Modal.Title>
                                                            <Button
                                                                variant=""
                                                                className="btn btn-close p-0 me-1"
                                                                onClick={() => {
                                                                    setShowModal(false);
                                                                }}
                                                            >
                                                                x
                                                            </Button>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <>
                                                                <SubscriptionGateway fromPage='tip' closeModal={closeModal} name={formik.values.Name} email={formik.values.email} message={formik.values.MessageText} amount={formik.values.Tip} user_id={userData? userData?.userData?.id : null} />
                                                            </>
                                                        </Modal.Body>
                                                    </Modal>
                                                </Form>

                                            </Col>
                                        </Row>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <ToastContainer />
                </div>
            }

            <Footer />
        </div >
    )
}
export default TipPage;