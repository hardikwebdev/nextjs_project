import React, { useState, useEffect, use } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { setFrontEndUserData, setBookmark } from "@/shared/redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';

function Header() {
    const [isCollapsed, setCollapsed] = useState(true);
    const [configsData, setConfigsData] = useState(true);
    const [data, setData] = useState("");
    const router = useRouter();
    let navigate = useRouter();

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const userData = useSelector((state) => state?.frontEndUserData);

    const getData = () => {
        getGeneralConfig()
            .then(({ data }) => {
                setConfigsData(data)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const profileData = () => {
        if (accessToken) {
            getProfile(accessToken)
                .then(({ data }) => {
                    setData(data.userProfileData);
                })
                .catch((error) => {
                    console.log("error", error);
                    if (error?.response?.data?.statusCode === 401) {
                        dispatch(setFrontEndUserData([]));
                    }
                })
        }
    }

    useEffect(() => {
        getData();
        profileData();
    }, [])

    const toggleCollapse = () => {
        setCollapsed(!isCollapsed);
    };

    const closeMenu = () => {
        setCollapsed(!isCollapsed);
    };
    const isActive = (currentPath, pathToCheck) => {
        return currentPath === pathToCheck;
    };

    const bgStyles = {
        backgroundColor: configsData?.header_footer_bg_color,
    };



    const fontColor = configsData?.header_footer_font_color;


useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        .fontColor {
            color: ${fontColor} !important;
        }
        .active {
            padding-bottom: 7px;
            border-bottom: 1px solid ${fontColor} !important;
        } 
    `;
    document.head.appendChild(style);
}, [fontColor]);


    const handleSignOut = () => {
        dispatch(setFrontEndUserData([]));
        dispatch(setBookmark([]));
        let path = `/`;
        navigate.push(path);
    };
    return (

        <Navbar expand="lg" variant="dark" className=' py-3 front-navbar' style={bgStyles}>
            <Container>
                <Link className="brand_logo p-0" href="/">
                    <img
                        src={configsData?.site_front_logo}
                        className="sign-favicon ht-40"
                        alt="logo"
                    />
                </Link>
                <span className='toggle_button d-lg-none' aria-controls="navbarSupportedContent" onClick={toggleCollapse}>
                    <i className="fas fa-bars"></i>
                </span>
                <Navbar.Collapse id="navbarSupportedContent" className={isCollapsed ? 'collapse' : 'show'}>
                    <span onClick={closeMenu} className='position-absolute closeButton d-lg-none'>
                        <i className="fas fa-times"></i>
                    </span>
                    <p className='logo_text text-uppercase text-center tx-26 m-0 fontColor d-lg-none' >
                        next
                    </p>
                    <Nav className="ms-auto mb-2 mb-lg-0 next_nav_anker pt-3 pt-lg-0 justify-content-end">

                        {configsData?.blog_toggle === 1 ?
                            <Nav.Item className={`px-4  nav-link-frontend-sidebar`}>
                                <Link
                                    href="/blog"
                                    className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/blog' ? 'active' : ''}`}
                                >
                                    Blog
                                </Link>
                            </Nav.Item>
                            : null}
                        {configsData?.news_toggle === 1 ?
                            <Nav.Item className="px-4 nav-link-frontend-sidebar">
                                <Link
                                    href="/news"
                                    className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/news' ? 'active' : ''}`}
                                >
                                    News
                                </Link>
                            </Nav.Item>
                            : null}
                        <Nav.Item className="px-4 nav-link-frontend-sidebar">
                            <Link
                                href="/about"
                                className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/about' ? 'active' : ''}`}
                            >
                                About
                            </Link>
                        </Nav.Item>

                        {userData?.userData?.id ? (
                            <>
                                <Nav.Item className="px-4 nav-link-frontend-sidebar">
                                    <Link
                                        href="/profile"
                                        className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/profile' ? 'active' : ''} ${router.pathname === '/frontend/profile/video-articles' ? 'active' : ''} ${router.pathname === '/frontend/profile/subscription-plan' ? 'active' : ''} ${router.pathname === '/frontend/profile/edit-account' ? 'active' : ''}`}
                                    >

                                        <span className='tx-16'><i className='tx-16 far fa-user-circle'></i> Account</span>
                                    </Link>
                                </Nav.Item>
                                <Nav.Item className="px-4 nav-link-frontend-sidebar">
                                    <span
                                        href="/"
                                        className={`tx-16 fontColor my-1 my-lg-0 cursor-pointer`}
                                        onClick={handleSignOut}
                                    >
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-top`}>Logout</Tooltip>}
                                        >
                                            <i className="si si-logout tx-16"></i>
                                        </OverlayTrigger>
                                    </span>
                                </Nav.Item>
                            </>


                        ) : (
                            <Nav.Item className="px-4 nav-link-frontend-sidebar">
                                <Link
                                    href="/account/login"
                                    className={`tx-16 fontColor my-1 my-lg-0 ${router.pathname === '/frontend/account/login' ? 'active' : ''}`}
                                >
                                    Account
                                </Link>
                            </Nav.Item>

                        )
                        }


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default Header;
