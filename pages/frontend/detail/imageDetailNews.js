import React, { useEffect, useState } from 'react';
import VideoComponent from '@/pages/generalFunctions';
import { Spinner, Container, Row, Form, Button, Alert, Col, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link'
import Header from '../header'
import Footer from '../footer'
import { getFrontBlogs } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud'
import { useSelector, useDispatch } from 'react-redux';
import { setBookmark, setBlogAndNewsData } from "@/shared/redux/actions/authAction";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendNewsComment, getComments } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud';
import { useRouter } from 'next/router';
import { getNewsData, setSavedBlogsData } from "@/shared/services/Front_Apis/account/accountCrud.js";
import * as clipboard from 'clipboard';
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';

function NewsDetailPage({ data }) {
    const [imagePreview, setImagePreview] = useState([])
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [generalConfigData, setGeneralConfigData] = useState();
    const [apiResponse, setApiResponse] = useState("success");
    const [chatMsgSuccesfull, setchatMsgSuccesfull] = useState();
    const [comments, setCommnets] = useState("")
    const [loading, setLoading] = useState(false);
    const [totalComments, setTotlaComments] = useState(null)
    const [expandedComments, setExpandedComments] = useState([]);
    const [linkCopy, setLinkCopy] = useState(false)
    const [profile, setProfile] = useState("");

    const handleViewMoreClick = (index) => {
        const newExpandedComments = [...expandedComments];
        newExpandedComments[index] = true;
        setExpandedComments(newExpandedComments);
    };

    const handleViewLessClick = (index) => {
        const newExpandedComments = [...expandedComments];
        newExpandedComments[index] = false;
        setExpandedComments(newExpandedComments);
    };
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalComments / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const dispatch = useDispatch();
    let navigate = useRouter();

    const bookMarkData = useSelector((state) => state?.bookmarkData);
    const access_token = useSelector((state) => state?.frontEndUserData?.access_token);
    const userData = useSelector((state) => state?.frontEndUserData);
    const userID = useSelector((state) => state?.frontEndUserData?.userData?.id);

    useEffect(() => {
        if (generalConfigData?.news_toggle === 0) {
            let path = `/`;
            navigate.push(path);
        }
    }, [generalConfigData]);
    function formatLongDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const isBookmarked = (item) => {
        return bookMarkData.some((bookmark) => bookmark?.blogposts?.id === item?.id && bookmark?.bookmarked);
    };
    const setBookmarkData = (blogposts) => {
        // if (bookMarkData?.length > 0) {
        const isBookmarked = bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === blogposts?.id && bookmark?.bookmarked);
        if (access_token) {
            console.log(access_token);
            setSavedBlogsData(access_token, userID, blogposts?.id, isBookmarked ? false : true)
                .then(({ data }) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        // } else {
        //     console.warn('bookMarkData is either not an array or it is empty');
        // }
    };

    const handleBookmark = (blogposts) => {
        const isBookmarked = bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === blogposts?.id && bookmark?.bookmarked);
        if (isBookmarked) {
            const updatedBookmarks = bookMarkData?.filter((bookmark) => bookmark?.blogposts?.id !== blogposts?.id || !bookmark?.bookmarked);
            dispatch(setBookmark(updatedBookmarks));
            setBookmarkData(blogposts);
        } else {
            const newBookmark = { blogposts, bookmarked: true };
            const updatedBookmarks = [...bookMarkData, newBookmark];
            dispatch(setBookmark(updatedBookmarks));
            setBookmarkData(blogposts);
        }
    }
    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    const getBlog = () => {
        const page = currentPage;
        const pageSize = 4; // Adjust based on your items per page
        const sortBy = "createdAt";
        const sortOrder = "DESC";
        const post_type = "news";
        getFrontBlogs(page, pageSize, sortBy, sortOrder, post_type, null, null, null, data?.id)
            .then(({ data }) => {
                setBlogs(data.blogsData);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const getBlogItem = () => {
        const page = 1;
        const pageSize = 10;
        const sortBy = "createdAt";
        const sortOrder = "DESC";

        if (access_token) {
            getNewsData(access_token, page, pageSize, sortBy, sortOrder, false)
                .then(({ data }) => {
                    dispatch(setBookmark(data?.savedBlogsData));

                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
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
    const getCommentsData = () => {
        const page = currentPage;
        const pageSize = itemsPerPage; // Adjust based on your items per page
        const sortBy = "createdAt";
        const sortOrder = "DESC";

        getComments(page, pageSize, sortBy, sortOrder, 1, data?.id)
            .then(({ data }) => {
                setCommnets(data)
                setTotlaComments(data?.total)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    useEffect(() => {
        getCommentsData();
    }, [currentPage])
    useEffect(() => {
        setImagePreview(data?.parsedBanner)
        getBlog();
        getGeneralConfigData();
        getCommentsData();
        getBlogItem();
    }, [])


    const profileData = () => {
        if (access_token) {
            getProfile(access_token)
                .then(({ data }) => {
                    setProfile(data.userProfileData);
                })
                .catch((error) => {
                })
                .finally(() => {
                })
        }
    }

    useEffect(() => {
        profileData();
    }, [access_token])


    const initialValues = {
        Name: userData ? userData.userData?.first_name + ' ' + userData.userData?.last_name : '',
        email: userData ? userData?.userData?.email : '',
        MessageText: '',
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
            .required("Comment is required")
            .test(
                "no-leading-trailing-spaces",
                "Comment cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
    });

    const formik = useFormik({
        initialValues,
        validationSchema: schema,
        onSubmit: (values, { setSubmitting }) => {
            setLoading(true);
            sendNewsComment(userData?.access_token, values.Name, userData?.userData?.email, values.MessageText, data?.id)
                .then(({ data }) => {
                    setApiResponse("success")
                    setchatMsgSuccesfull(true)
                })
                .catch((error) => {
                    setApiResponse("error")
                    setchatMsgSuccesfull(true)
                })
                .finally(() => {
                    setTimeout(() => {
                        setchatMsgSuccesfull(false)
                    }, 3500);
                    formik.resetForm();
                    setLoading(false)
                    setSubmitting(false);
                })
        },
    });


    const handleCopyLink = () => {
        const url = window.location.href;
        clipboard.copy(url);
        setLinkCopy(true)
    };

    useEffect(() => {
        setTimeout(() => {
            setLinkCopy(false)
        }, 3500)
    }, [linkCopy])



    return (
        <div>
            <Header />
            {/* Breadcrumb */}
            <div className='news_breadcrumb'>
                <Container>
                    <Row>
                        <Col>
                            <div className="breadcrumb-header justify-content-between my-0">
                                <div className="justify-content-center mt-3">
                                    <Breadcrumb className="breadcrumb">
                                        <Breadcrumb.Item className="breadcrumb-item tx-16 tx-bold" >
                                            <Link href="/">
                                                Home
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            className="breadcrumb-item tx-bold tx-16"
                                            aria-current="page"
                                        >
                                            <Link href='/news'>
                                                News
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            className="breadcrumb-item tx-bold tx-16"
                                            active
                                            aria-current="page"
                                        >
                                            {data?.title}
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='grey_hr'>
                <hr></hr>
            </div>

            <div className='news_detail_category'>
                <Container>
                    <Row>
                        <Col sm={12} md={12} lg={6}>
                            <div className='n_detail_img'>
                                {imagePreview?.length > 0 ?
                                    <>
                                        {imagePreview?.map((image) => (
                                            <>
                                                <img
                                                    className='w-100 h-100'
                                                    src={image?.Location}
                                                    alt={image?.title}
                                                />
                                            </>
                                        ))}
                                    </>
                                    :
                                    <div
                                        className="w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                                    >
                                        <h1> No image</h1>
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col sm={12} md={12} lg={6} className='d-flex justify-content-center flex-column mt-3 mt-lg-0'>
                            <div className='mw_xl_500 mw-500'>
                                <div className="category_badge">
                                    <span className='d-inline-block text-color-2 background-color-3 blue-white text-capitalize tx-12 tx-bold'>{data?.category?.title}</span>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                    <span className="m-0 text-color-4 tx-16">{data?.user.first_name + ' ' + data?.user.last_name}</span>
                                    <i className="fa fa-circle tx-6 mx-2"></i>
                                    <span className="text-color-4 tx-16">
                                        {formatDate(data?.createdAt)}
                                    </span>
                                </div>

                                <div className="mt-2">
                                    <h4 className="m-0 tx-12 text-color-2 tx-24 tx-lg-35 tx-xl-42">
                                        {data?.title}
                                    </h4>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                    <span className="m-0 tx-17 text-color-3">
                                        {data?.short_description}
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='news_detail py-lg-5 my-lg-2'>
                <Container>
                    <Row>
                        <Col md={12} lg={6} xl={7}>
                            <div className='mt-5 mt-lg-3'>
                                <div className='tx-17 text-capitalize' dangerouslySetInnerHTML={{ __html: data?.long_description }} />
                            </div>

                            <div>
                                {/* social media */}
                                <div className='social_media w-100 float-left mb-4 mt-5'>
                                    {/* <p className='copy_link m-0 d-inline-block me-2 float-left lh-2'><Link href="#" className='d-flex align-items-center padd_8_16 social_media_border'><img src={"../../../assets/img/front/Outline.png"}></img><span className='tx-18 ps-2'>Copy Link</span></Link></p> */}
                                    <p className='copy_link m-0 d-inline-block me-2 float-left lh-2'>
                                        {linkCopy ?
                                            <span className='d-flex align-items-center padd_8_16 social_media_border' ><i className='fa fa-check tx-14'></i><span className='tx-18 ps-2'>Link Copied</span>
                                            </span>
                                            :
                                            <span className='d-flex cursor-pointer align-items-center padd_8_16 social_media_border' onClick={handleCopyLink}><img src={"../../../assets/img/front/Outline.png"}></img><span className='tx-18 ps-2'>Copy Link</span>
                                            </span>
                                        }
                                    </p>
                                    <p className='social_icon social_media_border d-flex align-items-center justify-content-center m-0 d-inline-block me-2'><Link href={`${generalConfigData ? generalConfigData?.media_config_parsed?.facebook_link : "#"}`} target='_blank' className='d-flex align-items-center'><i className="fab fa-facebook-f"></i></Link></p>
                                    <p className='social_icon social_media_border d-flex align-items-center justify-content-center m-0 d-inline-block me-2'><Link href={`${generalConfigData ? generalConfigData?.media_config_parsed?.twitter_link : "#"}`} target='_blank' className='d-flex align-items-center'><i className="fab fa-twitter"></i></Link></p>
                                    <p className='social_icon social_media_border d-flex align-items-center justify-content-center m-0 d-inline-block'><Link href={`${generalConfigData ? generalConfigData?.media_config_parsed?.instagram_link : "#"}`} target='_blank' className='d-flex align-items-center'><i className="fab fa-instagram"></i></Link></p>
                                </div>
                                {access_token && generalConfigData && generalConfigData?.comments_toggle === 1 && (
                                    <>
                                        {/* comment */}
                                        {comments?.total > 0 ?
                                            <div className='comment_div'>
                                                <p className='tx-24 text-black'>Comments</p>
                                                {comments?.blogsCommentData?.map((data, index) => (
                                                    <div key={index} className='comment_data p-3 background-color-3 d-flex mb-4'>
                                                        <>
                                                            <div className='me-3 pe-2'>
                                                                {data?.user?.profile_url ? (
                                                                    <img alt="" src={data?.user?.profile_url} />
                                                                ) : (
                                                                    <img
                                                                        alt=""
                                                                        src={"../../../assets/img/squareAvatar.svg"}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className='tx-20 mb-1 text-color-2'>{data?.name}</p>
                                                                <p className='tx-16 mb-1 text-color-3'>{formatLongDate(data?.createdAt)}</p>
                                                                {data.comment.length > 255 ? (
                                                                    <>
                                                                        {expandedComments[index] ? (
                                                                            <>
                                                                                <p className='tx-17 text-color-3'>{data.comment}</p>
                                                                                <Button
                                                                                    variant=''
                                                                                    className='p-0 text-primary'
                                                                                    onClick={() => handleViewLessClick(index)}
                                                                                >
                                                                                    View Less
                                                                                </Button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <p className='tx-17 text-color-3'>{data.comment.substring(0, 255)}...</p>
                                                                                <Button
                                                                                    variant=''
                                                                                    className='p-0 text-primary'
                                                                                    onClick={() => handleViewMoreClick(index)}
                                                                                >
                                                                                    View More
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className='tx-17 text-color-3'>{data.comment}</p>
                                                                )}
                                                            </div>
                                                        </>
                                                    </div>
                                                ))}
                                                {
                                                    totalComments > itemsPerPage ? (
                                                        <>

                                                            <div className="d-flex">
                                                                <div className='w-100 text-start'>
                                                                    <Button
                                                                        variant=''
                                                                        className={`p-0 ${currentPage === 1 ? 'd-none' : ''}`}
                                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                                    >
                                                                        <i className="icon ion-ios-arrow-back me-2"></i>
                                                                        <span> Previous</span>
                                                                    </Button>
                                                                </div>


                                                                <div className='w-100 text-end'>
                                                                    <Button
                                                                        variant=''
                                                                        className={`p-0 ${currentPage === totalPages ? 'd-none' : ''}`}
                                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                                    >
                                                                        <span> Next</span>
                                                                        <i className="icon ion-ios-arrow-forward ms-2"></i>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : null
                                                }
                                            </div>
                                            : null}
                                        {/* leave comment */}
                                        <div className='leave_comment mt-3 mb-4'>
                                            <p className='tx-24 text-black'>Leave a comment</p>
                                            <Row className='collaborate_form comment_form'>
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
                                                                    {formik.errors.email && formik.touched.email && (
                                                                        <div className="text-danger">{formik.errors.email}</div>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>

                                                        </Row>
                                                        <Row>
                                                            <Col sm={12} md={12} lg={12}>
                                                                <div className="form-floating">

                                                                    <textarea className="form-control" placeholder="Message" id="floatingTextarea" name="MessageText"
                                                                        value={formik.values.MessageText}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.errors.MessageText && formik.touched.MessageText && (
                                                                        <div className="text-danger">{formik.errors.MessageText}</div>
                                                                    )}
                                                                    <label htmlFor="floatingTextarea"></label>
                                                                </div>


                                                            </Col>
                                                        </Row>
                                                        <div className='collaborate_btn mt-4'>
                                                            <Button variant="primary" className={`tx-18 ${loading ? 'disabled' : null}`} type="submit" id="submitButton">

                                                                {loading ?
                                                                    <Spinner animation="border"
                                                                        className="spinner-border spinner-border-sm "
                                                                        role="status"
                                                                    >
                                                                        <span className="sr-only">Loading...</span>
                                                                    </Spinner>
                                                                    : "Submit"}
                                                            </Button>
                                                        </div>

                                                    </Form>

                                                    {chatMsgSuccesfull ?
                                                        <>
                                                            {apiResponse === "success" ?
                                                                <Alert
                                                                    className={`alert mb-2 alert-success mt-3`}
                                                                    variant=""
                                                                >
                                                                    <Alert.Heading className='mb-0'>
                                                                        <h6 className="alert-heading mb-0">
                                                                            <i className="fa fa-check-circle me-2 tx-16"></i>
                                                                            Your comment is pending to approve from admin side.
                                                                        </h6>
                                                                    </Alert.Heading>
                                                                </Alert>
                                                                : <Alert
                                                                    className={`alert mb-2 alert-danger mt-3`}
                                                                    variant=""
                                                                >
                                                                    <Alert.Heading className='mb-0'>
                                                                        <h6 className="alert-heading mb-0">
                                                                            <i className="fa fa-check-circle me-2 tx-16"></i>
                                                                            Error
                                                                        </h6>
                                                                    </Alert.Heading>
                                                                </Alert>
                                                            }
                                                        </>
                                                        :
                                                        null
                                                    }
                                                </Col>

                                            </Row>

                                        </div>
                                    </>
                                )}
                            </div>


                        </Col>
                        <Col md={12} lg={6} xl={5} className='mt-4 mt-md-0 mb-4 mb-lg-0'>
                            <Row className='m-0'>
                                {blogs &&
                                    blogs.map((data, index) => (
                                        <>
                                            <Col sm={12} md={12} lg={12} xl={12} className='p-0'>
                                                <div key={index} className='news_card'>
                                                    <Card className="news_detail_blog rounded-0 flex-column flex-sm-row shadow-none bg-transparent">
                                                        <Link
                                                            href={
                                                                data?.content_type === "paid" &&
                                                                    profile?.subscriptionData?.plan_id !== 2
                                                                    ? `/profile/subscription-plan`
                                                                    : `/cpt_${[data.id]}`
                                                            }
                                                            as={
                                                                data?.content_type === "paid" &&
                                                                    profile?.subscriptionData?.plan_id !== 2
                                                                    ? `/profile/subscription-plan`
                                                                    : `/cpt_${encodeURIComponent(data?.id)}`
                                                            }

                                                        >
                                                            {data?.parsedBanner?.length > 0 ?
                                                                <>
                                                                    {data?.parsedBanner[0]?.type === "blog_image" ? (
                                                                        <img
                                                                            className="w-100 rounded-0 detail-side-img"
                                                                            src={data?.parsedBanner[0]?.Location}
                                                                            alt={data?.title}
                                                                        />
                                                                    ) : (
                                                                        null
                                                                    )}
                                                                    <>
                                                                        {data?.parsedBanner[0]?.type === "blog_video" ? (
                                                                            <VideoComponent videoSrc={data?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={data?.parsedBanner[0]?.video_duration} styling={`detail-side-img w-100`} />

                                                                        ) : (
                                                                            null
                                                                        )}
                                                                    </>
                                                                </>
                                                                :
                                                                <div
                                                                    className="detail-side-img w-100 position-relative d-flex justify-content-center align-items-center bordered"
                                                                >
                                                                    <h5> No image</h5>
                                                                </div>
                                                            }
                                                        </Link>

                                                        <Card.Body className='news_data position-relative p-2'>
                                                            <Link
                                                                href={
                                                                    data?.content_type === "paid" &&
                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                        ? `/profile/subscription-plan`
                                                                        : `/cpt_${[data.id]}`
                                                                }
                                                                as={
                                                                    data?.content_type === "paid" &&
                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                        ? `/profile/subscription-plan`
                                                                        : `/cpt_${encodeURIComponent(data?.id)}`
                                                                }

                                                            >
                                                                {/* <p className='tx-16 text-color-4 my-2'>{data.auther}</p> */}
                                                                <div className="text-muted d-flex align-items-center">
                                                                    <span className="tx-16 text-color-4 ">{data?.user.first_name}</span>
                                                                    <i className="fa fa-circle tx-6 mx-2"></i>
                                                                    <span className="tx-16 text-color-4 ">
                                                                        {formatDate(data?.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className='tx-20 text-color-2 m-0'>{data.title}</p>
                                                            </Link>
                                                        </Card.Body>
                                                        {access_token ?
                                                            <div className='d-flex bookmarkdiv'>
                                                                <button className="btn p-0 float-right bookmark_btn" onClick={() => handleBookmark(data)}>
                                                                    <img src={isBookmarked(data) ? "../../../assets/img/front/FilledBookmark2.png" : "../../../assets/img/front/bookmark.png"} alt="bookmark" />
                                                                </button>
                                                            </div>
                                                            : null}
                                                    </Card>
                                                </div>
                                                <div className='grey_hr'>
                                                    <hr></hr>
                                                </div>
                                            </Col>
                                        </>
                                    ))}
                                <Link href="/news" className='tx-18'><i className="fa fa-arrow-left me-2"></i>Go back to News</Link>
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div >


            <Footer />
        </div >
    )
};

export default NewsDetailPage;