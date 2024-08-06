import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Col, Row, Container, Button, Card, Modal } from "react-bootstrap";
import Link from 'next/link';
import Seo from "@/shared/layout-components/seo/seo";
import { useRouter } from 'next/router.js';
import Header from '../header.js';
import Footer from '../footer.js'
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';
import { sendSubscription } from '@/shared/services/Front_Apis/account/subscriptions/subscriptionsCrud.js'
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux';
import { getSubscriptions } from '@/shared/services/Front_Apis/account/subscriptions/subscriptionsCrud.js';
import SubscriptionGateway from '@/pages/subscriptionGateway.js';
import Swal from "sweetalert2";

const PersonalPage = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfileData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [subsPlans, setSubsPlans] = useState();
    const [generalConfigData, setGeneralConfigData] = useState();
    const [product_id, setProduct_id] = useState();
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;
    const dispatch = useDispatch();
    let navigate = useRouter();


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
                color: ${fontColor} !important;
              }
            .personal_profile_list li.active{
                list-style-type: none;
    border-bottom: 1px solid ${fontColor} !important;
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

    const profileData = () => {
        setLoading(true);
        getProfile(accessToken)
            .then(({ data }) => {
                setProfileData(data.userProfileData);
            })
            .catch((error) => {
                let path = `/account/login`;
                navigate.push(path);
            })
            .finally(() => {
                setLoading(false);
            })
    }



    const subscriptionPlans = () => {
        setLoading(true);
        getSubscriptions(accessToken)
            .then(({ data }) => {
                setSubsPlans(data);
            })
            .catch((error) => {
                console.log('error', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        if (!accessToken) {
            let path = `/account/login`;
            navigate.push(path)
        }
        profileData();
        subscriptionPlans();
    }, [])


    const modalOpen = (Id) => {
        setProduct_id(Id)
        setShowModal(true)
    }
    const [modalClosed, setModalClosed] = useState(false);

    const closeModal = () => {
        setShowModal(false);
        setModalClosed(true);
    };

    useEffect(() => {
        console.log('test');
        if (modalClosed) {
            profileData();
        }
    }, [modalClosed]);

    function Planchange(id) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success ms-2",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "Are you sure?",
                text: "Are you sure you want to go back to basic plan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "Cancel",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    handleDowngrade(id);
                }
            });
    }

    const handleDowngrade = (id) => {
        sendSubscription(
            accessToken,
            '',
            id
        )
            .then(({ data }) => {
                toast.success(data?.message, {
                    theme: "dark",
                });
            })
            .catch((error) => {
                toast.error(error?.response?.data?.description, {
                    theme: "dark",
                });
            })
            .finally(() => {
                profileData();
            });
    }

    useEffect(() => {
        if (subsPlans && profile?.subscriptionData !== undefined) {
            const sortedSubsPlans = [...subsPlans].sort((a, b) => {
                if (profile?.subscriptionData === null) {
                    return a.id - b.id;
                }
                if (profile.subscriptionData.plan_id === 3) {
                    if (a.id === profile.subscriptionData.plan_id) return -1;
                    if (b.id === profile.subscriptionData.plan_id) return 1;
                } else if (profile.subscriptionData.plan_id === 2) {
                    if (a.id === profile.subscriptionData.plan_id) return -1;
                    if (b.id === profile.subscriptionData.plan_id) return 1;
                }
                return a.id - b.id;
            });
            if (
                JSON.stringify(sortedSubsPlans) !== JSON.stringify(subsPlans)
            ) {
                setSubsPlans(sortedSubsPlans);
            }
        }
    }, [subsPlans, profile?.subscriptionData]);

    return (
        <React.Fragment>
            <div className='tan-block page'>
                <Seo title={"Subscription plans"} />
                <div>
                    <Header />
                    <div className='personal_profile text-center background-color-1 py-4'>
                        <h2 className='tx-36 tx-sm-42 text-white py-3'>
                            My subscription plan
                        </h2>
                    </div>
                </div>
                <div className='primaryThemeColor flex-1'>
                    <div className='py-5 '>
                        <Container>
                            <Row>
                                <Col sm={12} md={12} lg={3}>
                                    <div className='personal_left_data'>
                                        <ul className='personal_profile_list p-0'>
                                            <li className='tx-17 text-color-3 py-2 mb-2'>
                                                <Link href="/profile" className='text-color-3'>My personal profile</Link>
                                            </li>
                                            <li className='tx-17 text-color-3 py-2 mb-2'>
                                                <Link href="/profile/video-articles" className='text-color-3'>Saved videos and articles</Link>
                                            </li>
                                            <li className='tx-17 FontColor py-2 active'>
                                                <Link href="/profile/subscription-plan" className='FontColor'>My subscription plan</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>

                                <Col sm={12} md={12} lg={9}>
                                    <Row className="row-sm">
                                        {subsPlans &&
                                            subsPlans.map((data, index) => (
                                                <Col xl={6} lg={6} md={6} sm={12} className="  mt-4" key={index}>
                                                    <Card className={`card custom-card card-img-top-1 p-4 h-100 m-0 ${data.package_price == 0 ? '' : 'premium-plan-card'}`}>
                                                        <Card.Body className="p-0">
                                                            <div>
                                                                <div>
                                                                    <h4 className="text-primary tx-42">{data?.package_name}</h4>
                                                                    <span className="tx-20 text-color-3">
                                                                        {data?.package_price === '0' ? 'Free' : `$${data?.package_price}/${data?.duration}`}
                                                                    </span>
                                                                </div>

                                                                <div className="mt-3 tx-17 text-color-3">
                                                                    {data?.description}
                                                                </div>

                                                                <div className="mt-3">
                                                                    {data?.subDescription &&
                                                                        data?.subDescription.map((subData, subindex) => (
                                                                            <div className="d-flex align-items-center mb-2" key={subindex}>
                                                                                <i className="fa fa-check-circle tx-16 text-green">
                                                                                </i>
                                                                                <span className="font-weight-semibold ms-2 tx-17">
                                                                                    {subData}
                                                                                </span>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>

                                                                <div className={`mt-4 d-flex align-items-center pt-3 subBtnWidth`}>
                                                                    {data?.package_price === '0' ?
                                                                        profile?.subscriptionData === null ? (
                                                                            <>
                                                                                <i className="fe fe-check font-weight-bold"></i>
                                                                                <span className="ms-2 font-weight-semibold">Current plan</span>
                                                                            </>
                                                                        ) : (
                                                                            <Button
                                                                                type="button"
                                                                                onClick={() => Planchange(data?.id)}
                                                                                className="w-100 text-white btn btn-primary tx-18 tx-normal"
                                                                            >
                                                                                Go back to Basic
                                                                            </Button>
                                                                        )
                                                                        :
                                                                        data?.package_name === 'Premium' ?
                                                                            profile?.subscriptionData?.plan_id === 2 ? (
                                                                                <>
                                                                                    <i className="fe fe-check font-weight-bold"></i>
                                                                                    <span className="ms-2 font-weight-semibold">Current plan</span>
                                                                                </>
                                                                            ) : (
                                                                                <Button
                                                                                    className="w-100 text-white btn btn-primary tx-18 tx-normal"
                                                                                    onClick={() => modalOpen(data?.id)}
                                                                                >
                                                                                    {profile?.subscriptionData?.plan_id === 3 ? 'Go back to Premium' : 'Upgrade to Premium'}
                                                                                </Button>
                                                                            )
                                                                            :
                                                                            data?.package_name === 'Super' && profile?.subscriptionData?.plan_id === 3 ? (
                                                                                <>
                                                                                    <i className="fe fe-check font-weight-bold"></i>
                                                                                    <span className="ms-2 font-weight-semibold">Current plan</span>
                                                                                </>
                                                                            ) : (
                                                                                <Button
                                                                                    className="w-100 text-white btn btn-primary tx-18 tx-normal"
                                                                                    onClick={() => modalOpen(data?.id)}
                                                                                >
                                                                                    Upgrade to Super
                                                                                </Button>
                                                                            )
                                                                    }
                                                                </div>

                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}

                                        <Modal show={showModal} onHide={() => setShowModal(false)} size="md" className="previewModalFulll">
                                            <Modal.Header>
                                                <Modal.Title>
                                                    Subscription
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
                                                    <SubscriptionGateway fromPage='Subscription' closeModal={closeModal} product_id={product_id} />
                                                </>
                                            </Modal.Body>
                                        </Modal>

                                    </Row>

                                </Col>
                                <ToastContainer />
                            </Row>
                        </Container>

                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    )
}


export default PersonalPage;