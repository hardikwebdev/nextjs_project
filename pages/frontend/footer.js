import React, { useState, useEffect } from 'react';
import { Col, Row } from "react-bootstrap";
import Link from "next/link";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";


function Footer() {
    const router = useRouter();
    const [configsData, setConfigsData] = useState(true);
    const getData = () => {
        getGeneralConfig()
            .then(({ data }) => {
                setConfigsData(data)
            })
            .catch((error) => {
                console.log(error);
            })

    }
    useEffect(() => {
        getData()
    }, [])

    const userData = useSelector((state) => state?.frontEndUserData);
    const access_token = useSelector((state) => state?.frontEndUserData?.access_token);


    const bgStyles = {
        backgroundColor: configsData?.header_footer_bg_color,
    };

    const fontColor = configsData?.header_footer_font_color;

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
        .fontColor{
            color: ${fontColor} !important;
        }
        `;
        document.head.appendChild(style);
    }, [configsData]);


    return (
        <div className='footer_main  px-0 p-md-4 float-left w-100' style={bgStyles}>
            <Container className='my-1'>
                <Row>
                    <Col
                        md={4}
                        xs={12}
                    >
                        <Navbar.Brand className="brand_logo p-0" href="/">
                            <img
                                src={configsData?.site_front_logo}
                                className="sign-favicon ht-40"
                                alt="logo"
                            />
                        </Navbar.Brand>
                    </Col>
                    <Col
                        md={8}
                        xs={12}
                    >
                        <div className='footer_right_nav d-flex align-items-center'>
                            <Nav className="ms-md-auto  mb-2 mb-lg-0 next_nav_anker flex-column flex-md-row pt-3 pt-md-0">
                                {configsData?.blog_toggle === 1 ?
                                    <Nav.Item className="px-4">
                                        <Link href="/blog" className='tx-16 fontColor'>Blog</Link>
                                    </Nav.Item>
                                    : null}
                                {configsData?.news_toggle === 1 ?
                                    <Nav.Item className="px-4">
                                        <Link href="/news" className='tx-16 fontColor'>News</Link>
                                    </Nav.Item>
                                    : null}
                                <Nav.Item className="px-4">
                                    <Link href="/about" className='tx-16 fontColor'>About</Link>
                                </Nav.Item>

                                {userData?.userData?.id ? (
                                    <>
                                        <Nav.Item className="px-4">
                                            <Link
                                                href="/profile"
                                                className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/profile' ? 'active' : ''}`}
                                            >
                                                Account
                                            </Link>
                                        </Nav.Item>
                                    </>


                                ) : (

                                    <Nav.Item className="ps-4">
                                        <Link
                                            href="/account/login"
                                            className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/account/login' ? 'active' : ''}`}
                                        >
                                            Account
                                        </Link>
                                    </Nav.Item>
                                )
                                }
                                
                                {configsData?.tip_toggle === 1 ?
                                    <Nav.Item className="ps-4">
                                        <Link href="/tip" className='tx-16 fontColor'>Tip</Link>
                                    </Nav.Item>
                                    : null}

                            </Nav>
                        </div>
                    </Col>
                </Row>

                <Row className='mt-2 mt-md-3'>
                    <Col className='order-1 order-md-0 mt-2 mt-md-0'
                        md={6}
                        xs={12}
                    >
                        <div className='copyright_data'>
                            <p className='m-0 tx-xl-15 fontColor'>©2023 Next.js. All rights reserved.</p>
                        </div>
                    </Col>
                    <Col className='order-0 order-md-1'
                        md={6}
                        xs={12}
                    >
                        <div className='social_icons'>
                            <ul className="list-group list-group-horizontal bg-transparent justify-content-start justify-content-md-end">
                                <li className="list-group-item bg-transparent border-0 py-0">
                                    <Link href={`${configsData ? configsData?.media_config_parsed?.facebook_link : "#"}`} target='_blank'>
                                        <i className="fab fa-facebook-f tx-xl-24 fontColor"></i>
                                    </Link>
                                </li>
                                <li className="list-group-item bg-transparent border-0 py-0">
                                    <Link href={`${configsData ? configsData?.media_config_parsed?.twitter_link : "#"}`} target='_blank'>
                                        <i className="fab fa-twitter tx-xl-24 fontColor"></i>
                                    </Link>
                                </li>
                                <li className="list-group-item bg-transparent border-0 py-0">
                                    <Link href={`${configsData ? configsData?.media_config_parsed?.instagram_link : "#"}`} target='_blank'>
                                        <i className="fab fa-instagram tx-xl-24 fontColor"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer;
