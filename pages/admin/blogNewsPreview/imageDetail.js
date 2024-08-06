import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function ImagePreview({ data }) {
    const [imagePreview, setImagePreview] = useState([])

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    useEffect(() => {
        setImagePreview(data?.parsedBanner);
    }, [])

    return (
        <div>

            <div className='news_detail_category'>
                <Container>
                    <Row>
                        <Col sm={12} md={12} lg={6}>
                            <div className='n_detail_img h-100'>
                                {imagePreview?.length > 0 ?
                                    <>
                                        {imagePreview?.map((image) => (
                                            <>
                                                <img
                                                    className='w-100 h-100'
                                                    src={image?.Location ? image?.Location : image}
                                                    alt={image?.title}
                                                />
                                            </>
                                        ))}
                                    </>
                                    :
                                    <div
                                        className="w-100 h-100 position-relative d-flex justify-content-center align-items-center table-bordered"
                                    >
                                        <h1> No image</h1>
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col sm={12} md={12} lg={6} className='d-flex justify-content-center flex-column mt-3 mt-lg-0'>
                            <div className='mw_xl_500 mw-500'>
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
                        </Col>
                    </Row>
                </Container>
            </div >




        </div >
    )
};

export default ImagePreview;