import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Seo from '@/shared/layout-components/seo/seo';
import { getCategory } from "../../../shared/services/Admin_Apis/category/categoryCrud";
import { getBlogs } from "@/shared/services/Admin_Apis/blog-news/blogNewsCrud";
import { getUsers } from "@/shared/services/Admin_Apis/user/userCrud";
import { getGeneralConfigs } from '@/shared/services/Admin_Apis/genralConfigs/genralConfigsCrud';
import { getSubscriptions } from "@/shared/services/Admin_Apis/subscriptions/subscriptionsCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData, setGeneralConfigs, setCommentType } from "@/shared/redux/actions/authAction";
import { getDashboardData } from "../../../shared/services/Admin_Apis/dashboard/dashboardCrud"
import Link from "next/link";


const Dashboard = () => {
    const [totalCategories, setTotalCategories] = useState(null)
    const [totalPendingComments, setTotalPendingComments] = useState(null)
    const [totalBlogs, setTotalBlogs] = useState(null)
    const [totalNews, setTotalNews] = useState(null)
    const [totalUsers, setTotalUSers] = useState(null)
    const [totalSubscriptions, setTotalSubscriptions] = useState(null)


    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state?.userData?.access_token);
    let navigate = useRouter();

    const getAllData = () => {
        getDashboardData(accessToken)
            .then(({ data }) => {
                console.log(data);
                setTotalCategories(data?.categoryCount)
                setTotalPendingComments(data?.pendingCommentsCount)
                setTotalBlogs(data?.blogsCount)
                setTotalNews(data?.newsCount)
                setTotalUSers(data?.usersCount)
                setTotalSubscriptions(data?.subscriptionCount)
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    toast.error(error?.response?.data?.description, {
                        theme: "dark",
                    });
                } else {
                    toast.error(error?.response?.data?.message[0], {
                        theme: "dark",
                    });
                }
                if (error?.response?.data?.statusCode === 401) {
                    dispatch(setUserData(null));
                    let path = `/admin/login`;
                    navigate.push(path);
                }

            })

        getGeneralConfigs(accessToken)
            .then(({ data }) => {
                dispatch(setGeneralConfigs(data));
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    toast.error(error?.response?.data?.description, {
                        theme: "dark",
                    });
                } else {
                    toast.error(error?.response?.data?.message[0], {
                        theme: "dark",
                    });
                }
                if (error?.response?.data?.statusCode === 401) {
                    dispatch(setUserData(null));
                    let path = `/admin/login`;
                    navigate.push(path);
                }

            })

    }
    useEffect(() => {
        getAllData()
    }, [])

    const getData = () => {
        getGeneralConfigs(accessToken)
            .then(({ data }) => {
                dispatch(setGeneralConfigs(data));
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    toast.error(error?.response?.data?.description, {
                        theme: "dark",
                    });
                } else {
                    toast.error(error?.response?.data?.message[0], {
                        theme: "dark",
                    });
                }
                if (error?.response?.data?.statusCode === 401) {
                    dispatch(setUserData(null));
                    let path = `/admin/login`;
                    navigate.push(path);
                }

            })

    }
    useEffect(() => {
        getData()
    }, [])

    const handlePandingComents = () => {
        dispatch(setCommentType("pending"))
        let path = `/admin/comments`;
        navigate.push(path);
    }
    return (
        <div className='pb-4'>
            <Seo title={"Dashboard"} />
            {/* General config title start */}
            <Card className="mt-4">
                <Card.Body className="py-0">
                    <div className="breadcrumb-header justify-content-between">
                        <div className="left-content">
                            <span className="main-content-title mg-b-0 mg-b-lg-1">
                                Dashboard
                            </span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            {/* General config title end */}


            {/* <!-- row --> */}
            <Row>
                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="fe fe-grid tx-20 me-2 text-primary"></i>
                                    <span>
                                        Total Categories
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalCategories}
                                    </h4>
                                </div>
                            </div>

                            <div className='mt-2'>
                                <Link href="/admin/categories" className='text-info tx-15'>View all categories</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="fe fe-file-plus tx-20 me-2 text-primary"></i>
                                    <span>
                                        Total Blogs
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalBlogs}
                                    </h4>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Link href="/admin/blogs" className='text-info tx-15'>View all blogs</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="far fa-newspaper me-2 text-primary"></i>
                                    <span>
                                        Total News
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalNews}
                                    </h4>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Link href="/admin/news" className='text-info tx-15'>View all news</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="fab fa-wpforms me-2 text-primary"></i>
                                    <span>
                                        Total Subscriptions
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalSubscriptions}
                                    </h4>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Link href="/admin/subscription/" className='text-info tx-15'>View all subscriptions</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="fe fe-users me-2 text-primary"></i>
                                    <span>
                                        Total Users
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalUsers}
                                    </h4>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <Link href="/admin/users/" className='text-info tx-15'>View all users</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={6}>
                    <Card className='shadow-search'>
                        <Card.Body>
                            <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                <div className='d-flex align-items-center'>
                                    <i className="far fa-comment-dots tx-20 me-2 text-primary"></i>
                                    <span>
                                        Pending comments
                                    </span>
                                </div>
                                <div>
                                    <h4 className="tx-20 font-weight-semibold mb-0">
                                        {totalPendingComments}
                                    </h4>
                                </div>
                            </div>

                            <div className='mt-2'>
                                <span
                                    className={`text-info tx-15  ${totalPendingComments === 0 ? '' : 'cursor-pointer'}`}
                                    onClick={() => totalPendingComments !== 0 && handlePandingComents()}
                                >
                                    View all pending comments
                                </span>
                                {/* <span className='text-info tx-15 cursor-pointer' onClick={handlePandingComents}></span> */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
            <ToastContainer />
        </div >
    )
};

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

Dashboard.layout = "Contentlayout"

export default Dashboard;
