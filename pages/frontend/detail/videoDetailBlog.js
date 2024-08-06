import React, { useEffect, useState } from 'react';
import { Spinner, Container, Row, Col, Form, Button, Alert, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link'
import Header from '../header'
import Footer from '../footer'
import { useSelector, useDispatch } from 'react-redux';
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendComment, getComments } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud';
import { useRouter } from 'next/router';
import * as clipboard from 'clipboard';


function BlogDetaiPage({ data }) {
    const [imagePreview, setImagePreview] = useState([])
    const [generalConfigData, setGeneralConfigData] = useState();
    const [apiResponse, setApiResponse] = useState("success");
    const [chatMsgSuccesfull, setchatMsgSuccesfull] = useState();
    const [comments, setCommnets] = useState("")
    const [totalComments, setTotlaComments] = useState(null)
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedComments, setExpandedComments] = useState([]);
    const [linkCopy, setLinkCopy] = useState(false)

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
    const dispatch = useDispatch();
    let navigate = useRouter();
    const access_token = useSelector((state) => state?.frontEndUserData?.access_token);
    const userData = useSelector((state) => state?.frontEndUserData);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalComments / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    useEffect(() => {
        if (generalConfigData?.blog_toggle === 0) {
            let path = `/`;
            navigate.push(path);
        }
    }, [generalConfigData]);

    function formatLongDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
        getGeneralConfigData()
        getCommentsData();
    }, [])
    useEffect(() => {
        setImagePreview(data?.parsedBanner)
    })

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }



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
            sendComment(userData?.access_token, values.Name, userData?.userData?.email, values.MessageText, data?.id)
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
                    setLoading(false);
                    formik.resetForm();
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
                                        <Breadcrumb.Item className="breadcrumb-item tx-16 tx-bold">
                                            <Link href='/'>
                                                Home
                                            </Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item
                                            className="breadcrumb-item tx-bold tx-16"
                                            aria-current="page"
                                        >
                                            <Link href='/blog'>
                                                Blogs
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

            <div className='blog_video_player mt-3'>
                {imagePreview?.length > 0 ?
                    <>
                        {imagePreview?.map((image, index) => (
                            <>
                                {image.type === "blog_image" ? (
                                    <img
                                        className='w-100'
                                        src={image?.Location}
                                        alt={image?.title}
                                    />
                                ) : (
                                    <video controls width="100%">
                                        <source src={image.Location} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
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
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className='detail_content mt-3'>
                                <div className="category_badge">
                                    <span className='d-inline-block text-color-2 background-color-3 blue-white text-capitalize tx-12 tx-bold'>{data?.category?.title}</span>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                    <span className="m-0 text-color-4 tx-16">{data?.user?.first_name + ' ' + data?.user?.last_name}</span>
                                    <i className="fa fa-circle tx-6 mx-2"></i>
                                    <span className="text-color-4 tx-16">
                                        {formatDate(data?.createdAt)}
                                    </span>
                                </div>
                                <p className='d_title tx-28 tx-lg-35 tx-xl-42 mt-3 mb-0 lh-2 text-capitalize'>{data?.title}</p>
                                {/* <p className='d_title tx-28 tx-lg-35 tx-xl-42 mb-0 lh-2 '>Header 2</p> */}
                                <p className='dsub_title tx-17 tx-sm-24 mb-0 text-capitalize'>{data?.short_description}</p>

                                <div className='mt-3'>
                                    <div className='tx-17 text-capitalize' dangerouslySetInnerHTML={{ __html: data?.long_description }} />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* social media */}
                    <div className={`social_media w-100 float-left mb-4 mt-5`}>
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
                </Container>
            </div >


            <Footer />
        </div >
    )
};

export default BlogDetaiPage;