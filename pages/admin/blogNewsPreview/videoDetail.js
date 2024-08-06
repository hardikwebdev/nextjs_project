import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link'
// import Header from '../header'
// import Footer from '../footer'
import { useSelector, useDispatch } from 'react-redux';
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendComment, getComments } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud';
import { useRouter } from 'next/router';

function VideoPreview({ data }) {
    const [imagePreview, setImagePreview] = useState([])

    // const data = useSelector((state) => state?.blogNewsData);

    useEffect(() => {
        setImagePreview(data?.parsedBanner)
    })

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }





    return (
        <div>

            <div className='blog_video_player mt-3'>
                {imagePreview?.length > 0 ?
                    <>
                        {imagePreview?.map((image, index) => (
                            <>
                                    <video controls width="100%">
                                        <source src={image.Location ? image?.Location : image} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
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
                                    <span className='d-inline-block text-color-2 background-color-3 blue-white text-capitalize tx-12 tx-bold'>{data?.category?.label}</span>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                    <span className="m-0 text-color-4 tx-16">{data?.user.label}</span>
                                    <i className="fa fa-circle tx-6 mx-2"></i>
                                    <span className="text-color-4 tx-16">
                                        {formatDate(data?.publish_date)}
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





                </Container>
            </div >


        </div >
    )
};

export default VideoPreview;