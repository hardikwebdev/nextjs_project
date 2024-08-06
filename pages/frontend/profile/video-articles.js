import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Col, Row, Container, Button, Card, Pagination, FormGroup } from "react-bootstrap";
import Select from "react-select";
import Link from 'next/link';
import { getBlogData, getNewsData } from "@/shared/services/Front_Apis/account/accountCrud.js";
import Seo from "@/shared/layout-components/seo/seo";
import Header from '../header.js';
import Footer from '../footer.js'
import { useRouter } from 'next/router.js';
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs, setBlogAndNewsData } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import VideoComponent from '@/pages/generalFunctions';
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';

const PersonalPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [blogData, setblogData] = useState([]);
    const [totalBlog, setTotalBlog] = useState(null);
    const [categories, setCategories] = useState([]);
    const [itemperPage, setItemperPage] = useState(10);
    const [generalConfigData, setGeneralConfigData] = useState();
    const [NewsData, setnewsData] = useState([]);
    const [totalNews, setTotalNews] = useState(null);
    const [selectNews, setselectNews] = useState(10);
    const [saveArticles, setsaveArticles] = useState(false)
    const [profile, setProfile] = useState("");
    const [loading, setLoading] = useState(true)
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const totalPages = Math.ceil(totalBlog / itemperPage);
    const totalPagesForNews = Math.ceil(totalNews / itemperPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;
    const dispatch = useDispatch(); // Get the dispatch function

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

    const handleSavedArticleButton = (data) => {
        if (data === "true") {
            setsaveArticles(true)
        }
        if (data === "false") {
            setsaveArticles(false)
        }
        setLoading(true);
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
                color: ${fontColor};
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

    const profileData = () => {
        if (accessToken) {
            getProfile(accessToken)
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
        getGeneralConfigData();
        profileData();
    }, [])

    const totalBlogData = [
        { value: '10', label: '10' },
        { value: '50', label: '50' },
        { value: '100', label: '100' }
    ]


    const totalNewsData = [
        { value: '10', label: '10' },
        { value: '50', label: '50' },
        { value: '100', label: '100' }
    ]


    let navigate = useRouter();
    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getBlogItem = () => {
        const page = currentPage;
        const pageSize = itemperPage; // Adjust based on your items per page
        const sortBy = "createdAt";
        const sortOrder = "DESC";

        if (accessToken) {

            getBlogData(accessToken, page, pageSize, sortBy, sortOrder, true)
                .then(({ data }) => {
                    setblogData(data.savedBlogsData);
                    setTotalBlog(data.total)
                    setCategories(data.total)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false)
                })
        }
    }

    const getNewsItem = () => {
        const page = currentPage;
        const pageSize = itemperPage; // Adjust based on your items per page
        const sortBy = "createdAt";
        const sortOrder = "DESC";


        getNewsData(accessToken, page, pageSize, sortBy, sortOrder, true)
            .then(({ data }) => {
                setnewsData(data.savedBlogsData);
                setTotalNews(data.total)
                setCategories(data.total)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            })
    }


    useEffect(() => {
        getBlogItem();
        getNewsItem();
        if (!accessToken) {
            let path = `/account/login`;
            navigate.push(path)
        }
    }, [])

    useEffect(() => {
        getBlogItem();
        getNewsItem()
    }, [currentPage])

    useEffect(() => {
        getBlogItem()
        getNewsItem()
        setCurrentPage(1);
    }, [saveArticles, itemperPage])

    useEffect(() => {
        setItemperPage(10)
    }, [saveArticles])

    return (
        <React.Fragment>
            <div className='tan-block page'>
                <Seo title={"Articles"} />
                <div>
                    <Header />
                    <div className='personal_profile text-center background-color-1 py-4'>
                        <h2 className='tx-36 tx-sm-42 text-white py-3'>
                            Saved videos and articles
                        </h2>
                    </div>
                </div>

                <div className='primaryThemeColor flex-1'>
                    <div className='py-5'>
                        <Container>
                            <Row>
                                <Col sm={12} md={12} lg={3}>
                                    <div className='personal_left_data'>
                                        <ul className='personal_profile_list p-0'>
                                            <li className='tx-17 text-color-3 py-2 mb-2'>
                                                <Link href="/profile" className='text-color-3'>My personal profile</Link>

                                            </li>
                                            <li className='tx-17 FontColor py-2 mb-2 active'>
                                                <Link href="/profile/video-articles" className='FontColor'>Saved videos and articles</Link>
                                            </li>
                                            <li className='tx-17 text-color-3 py-2'>
                                                <Link href="/profile/subscription-plan" className='text-color-3'>My subscription plan</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col sm={12} md={12} lg={9}>
                                    <div>
                                        <Button variant="" className={`btn ${saveArticles ? 'secondaryButtonColor' : 'primaryButtonColor'} FontColor save_articles_btn tx-17 text-color-2 me-3`} type="" onClick={() => handleSavedArticleButton("false")}>
                                            <span>Saved videos</span>
                                        </Button>

                                        <Button variant="" className={`btn tx-17 ${saveArticles ? 'primaryButtonColor' : 'secondaryButtonColor'} FontColor save_articles_btn text-color-2`} type="" onClick={() => handleSavedArticleButton("true")}>
                                            <span>Saved articles</span>
                                        </Button>
                                    </div>

                                    <div className='video_head mt-4 FontColor'>
                                        {!saveArticles ?
                                            <h4>There {totalBlog} {totalBlog === 0 ? 'item' : totalBlog === 1 ? 'item' : 'items'} here</h4>
                                            :
                                            <h4>There {totalNews} {totalNews === 0 ? 'item' : totalNews === 1 ? 'item' : 'items'} here</h4>
                                        }
                                    </div>

                                    <Row className={loading ? 'justify-content-center' : null}>
                                        {loading ?
                                            <div className="text-center">
                                                <div className="lds-spinner">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                            :
                                            <>
                                                {saveArticles ?

                                                    <>
                                                        {NewsData.length > 0 ?
                                                            <>
                                                                {NewsData &&
                                                                    NewsData.map((data, index) => (
                                                                        <Col sm={12} md={12} lg={12} xl={12}>
                                                                            {/* <Link href={`/news/news-detail?id=${encodeURIComponent(JSON.stringify(data?.blogposts?.id))}`}> */}
                                                                            <Link
                                                                                href={
                                                                                    data?.content_type === "paid" &&
                                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                                        ? `/profile/subscription-plan`
                                                                                        : `/cpt_${[data?.blogposts?.id]}`
                                                                                }
                                                                                as={
                                                                                    data?.content_type === "paid" &&
                                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                                        ? `/profile/subscription-plan`
                                                                                        : `/cpt_${encodeURIComponent(data?.blogposts?.id)}`
                                                                                }

                                                                            >
                                                                                <div key={index} className='news_card'>
                                                                                    <Card className="flex-column flex-sm-row shadow-none ">
                                                                                        {data?.blogposts.parsedBanner?.length > 0 ?
                                                                                            <>
                                                                                                {data?.blogposts.parsedBanner[0].type === "blog_image" ? (
                                                                                                    <img
                                                                                                        className="news-card-img w-100 h-auto"
                                                                                                        src={data?.blogposts.parsedBanner[0]?.Location}
                                                                                                        alt={data?.blogposts.title}
                                                                                                    />
                                                                                                ) : (
                                                                                                    null
                                                                                                )}
                                                                                                <>
                                                                                                    {data?.blogposts.parsedBanner[0].type === "blog_video" ? (
                                                                                                        <VideoComponent videoSrc={data?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={data?.parsedBanner[0]?.video_duration} styling={`news-card-img w-100`} />

                                                                                                    ) : (
                                                                                                        null
                                                                                                    )}
                                                                                                </>
                                                                                            </>
                                                                                            :

                                                                                            <div
                                                                                                className="news-card-img h-auto w-100 d-flex justify-content-center align-items-center"
                                                                                            >
                                                                                                <h1> No image</h1>
                                                                                            </div>
                                                                                        }
                                                                                        <Card.Body className='news_data position-relative'>
                                                                                            <p className='tx-16 my-2 text-color-4'>{data?.blogposts?.user?.first_name} • {formatDate(data?.blogposts.createdAt)}</p>
                                                                                            <span className='tx-20 m-0 text-color-2'>{data?.blogposts.title}</span>
                                                                                        </Card.Body>
                                                                                    </Card>

                                                                                    <div className='grey_hr'>
                                                                                        <hr></hr>
                                                                                    </div>
                                                                                </div>
                                                                            </Link>
                                                                        </Col>
                                                                    ))}

                                                                {
                                                                    totalNews > itemperPage ? (
                                                                        <>
                                                                            <Col sm={12} md={12} lg={12} xl={12}>
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
                                                                                            className={`p-0 ${currentPage === totalPagesForNews ? 'd-none' : ''}`}
                                                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                                                        >
                                                                                            <span> Next</span>
                                                                                            <i className="icon ion-ios-arrow-forward ms-2"></i>
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        </>
                                                                    ) : null
                                                                }
                                                                <Col sm={12} md={12} lg={12} xl={12}>
                                                                    <div className="pagination_div mt-5">
                                                                        <div className='d-flex justify-content-end align-items-center'>
                                                                            <div className='acc_news_filter'>
                                                                                <FormGroup>
                                                                                    <Select
                                                                                        classNamePrefix="selectform cursor-pointer"
                                                                                        options={totalNewsData}
                                                                                        placeholder="Select page size"
                                                                                        noOptionsMessage={() => "No matching found"}
                                                                                        defaultValue={totalNewsData.find(option => option.value === '10')}
                                                                                        onChange={(itemperPage) => {
                                                                                            setItemperPage(itemperPage?.value);
                                                                                        }}
                                                                                    />
                                                                                </FormGroup>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </>
                                                            :
                                                            <Col sm={12}>
                                                                <div className='text-center'>
                                                                    <h2>You have no saved articles</h2>
                                                                </div>
                                                            </Col>
                                                        }
                                                    </>

                                                    :
                                                    <>
                                                        {blogData.length > 0 ?
                                                            <>
                                                                {blogData &&
                                                                    blogData.map((data, index) => (
                                                                        <Col sm={12} md={12} lg={12} xl={12}>
                                                                            <Link
                                                                                href={
                                                                                    data?.content_type === "paid" &&
                                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                                        ? `/profile/subscription-plan`
                                                                                        : `/cpt_${[data?.blogposts?.id]}`
                                                                                }
                                                                                as={
                                                                                    data?.content_type === "paid" &&
                                                                                        profile?.subscriptionData?.plan_id !== 2
                                                                                        ? `/profile/subscription-plan`
                                                                                        : `/cpt_${encodeURIComponent(data?.blogposts?.id)}`
                                                                                }

                                                                            >
                                                                                <div key={index} className='news_card'>
                                                                                    <Card className="flex-column flex-sm-row shadow-none ">
                                                                                        {data?.blogposts.parsedBanner?.length > 0 ?
                                                                                            <>
                                                                                                {data?.blogposts.parsedBanner[0].type === "blog_image" ? (
                                                                                                    <img
                                                                                                        className="news-card-img w-100 h-auto"
                                                                                                        src={data?.blogposts.parsedBanner[0]?.Location}
                                                                                                        alt={data?.blogposts.title}
                                                                                                    />
                                                                                                ) : (
                                                                                                    null
                                                                                                )}
                                                                                                <>
                                                                                                    {data?.blogposts.parsedBanner[0]?.type === "blog_video" && data.blogposts.parsedBanner.length > 0 ? (
                                                                                                        <VideoComponent
                                                                                                            videoSrc={data.blogposts.parsedBanner[0]?.video_thumbnail?.Location}
                                                                                                            videoDuration={data.blogposts.parsedBanner[0]?.video_duration}
                                                                                                            styling={`news-card-img w-100`}
                                                                                                        />
                                                                                                    ) : (
                                                                                                        null
                                                                                                    )}

                                                                                                </>
                                                                                            </>
                                                                                            :

                                                                                            <div
                                                                                                className="news-card-img h-auto w-100 d-flex justify-content-center align-items-center"
                                                                                            >
                                                                                                <h1> No image</h1>
                                                                                            </div>
                                                                                        }
                                                                                        <Card.Body className='news_data position-relative'>
                                                                                            <p className='tx-16 my-2 text-color-4'>{data?.blogposts?.user?.first_name} • {formatDate(data?.blogposts.createdAt)}</p>
                                                                                            <span className='tx-20 m-0 text-color-2'>{data?.blogposts.title}</span>
                                                                                        </Card.Body>
                                                                                    </Card>

                                                                                    <div className='grey_hr'>
                                                                                        <hr></hr>
                                                                                    </div>
                                                                                </div>
                                                                            </Link>
                                                                        </Col>
                                                                    ))}
                                                                {
                                                                    totalBlog > itemperPage ? (
                                                                        <>
                                                                            <Col sm={12} md={12} lg={12} xl={12}>
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
                                                                            </Col>
                                                                        </>
                                                                    ) : null
                                                                }
                                                                <Col sm={12} md={12} lg={12} xl={12}>
                                                                    <div className="pagination_div mt-5">
                                                                        <div className='d-flex justify-content-end align-items-center'>
                                                                            <div className='acc_news_filter'>
                                                                                <FormGroup>
                                                                                    <Select
                                                                                        classNamePrefix="selectform cursor-pointer"
                                                                                        options={totalBlogData}
                                                                                        placeholder="Select page size"
                                                                                        noOptionsMessage={() => "No matching found"}
                                                                                        defaultValue={totalBlogData.find(option => option.value === '10')}
                                                                                        onChange={(itemperPage) => {
                                                                                            setItemperPage(itemperPage?.value);
                                                                                        }}
                                                                                    />
                                                                                </FormGroup>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </>
                                                            :
                                                            <Col sm={12}>
                                                                <div className='text-center'>
                                                                    <h2>You have no saved video</h2>
                                                                </div>
                                                            </Col>
                                                        }
                                                    </>
                                                }
                                            </>
                                        }
                                    </Row>


                                </Col>

                            </Row>
                        </Container>

                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment >
    )
}


export default PersonalPage;