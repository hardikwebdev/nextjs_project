import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Spinner, Col, Row, Container } from "react-bootstrap";
import Link from 'next/link';
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';
import { useRouter } from 'next/router';
import Header from '../header.js';
import Footer from '../footer.js'
import Seo from "@/shared/layout-components/seo/seo";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook

const PersonalPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");
    const [generalConfigData, setGeneralConfigData] = useState();
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;
    const dispatch = useDispatch(); // Get the dispatch function

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
                setData(data.userProfileData);
            })
            .catch((error) => {
                let path = `/account/login`;
                navigate.push(path);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        profileData();
    }, [])

    return (
        <React.Fragment>
            <div className='tan-block page'>
                <Seo title={"Profile"} />
                <div>
                    <Header />
                    <div className='personal_profile text-center background-color-1 py-4'>
                        <h2 className='tx-36 tx-sm-42 text-white py-3'>
                            My personal profile
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
                                            <li className='tx-17 FontColor py-2 mb-2 active'>
                                                <Link href="/profile" className='FontColor'>My personal profile</Link>

                                            </li>
                                            <li className='tx-17 text-color-3 py-2 mb-2'>
                                                <Link href="/profile/video-articles" className='text-color-3'>Saved videos and articles</Link>
                                            </li>
                                            <li className='tx-17 text-color-3 py-2'>
                                                <Link href="/profile/subscription-plan" className='text-color-3'>My subscription plan</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>

                                <Col sm={12} md={12} lg={9} className={`personal_profile_h_fix FontColor`}>
                                    {loading ?
                                        <Spinner animation="border"
                                            className="spinner-border spinner-border-sm ms-3"
                                            role="status"
                                        >
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                        :
                                        <>
                                            <div>
                                                <div className='d-flex personal_profile_img align-items-center '>
                                                    <img src={data.profile_url} className='me-3' alt='' />
                                                    <h4 className='tx-20 FontColor'>{data.first_name + " " + data.last_name}</h4>
                                                </div>
                                            </div>
                                            <div className='grey_hr'>
                                                <hr></hr>
                                            </div>

                                            <div >
                                                <p className='tx-17 FontColor'>{data.first_name}</p>
                                                <p className='tx-17 FontColor'>{data.email}</p>
                                                <p className='tx-17 FontColor'>{data.address}</p>
                                                <p className='tx-17 FontColor'>{data.bio}</p>
                                            </div>

                                            <div>
                                                <Link href={"/profile/edit-account"} className="FontColor btn primaryButtonColor py-3 px-3 tx-18 br-6 tx-normal mb-md-3 mb-sm-3 mb-xs-3 mb-lg-0">
                                                    Edit Profile
                                                </Link>
                                            </div>
                                        </>
                                    }
                                </Col>
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