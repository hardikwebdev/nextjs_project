import React, { useEffect, useRef, useState } from 'react';
import Header from '../header';
import Footer from '../footer';
import { Button, Col, Form, Row, Card, Container, Alert, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import Carousel from 'react-bootstrap/Carousel';
import { getHomePage, getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/router";
import Link from 'next/link';
import { setBookmark, setFrontEndUserData, setBlogAndNewsData } from "@/shared/redux/actions/authAction";
import { useDispatch, useSelector } from 'react-redux'; // Import the useDispatch hook
import Seo from "@/shared/layout-components/seo/seo";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import ReCAPTCHA from "react-google-recaptcha";
import { sendChat, sendChatWithLogin } from '@/shared/services/Front_Apis/homePage/homePageCrud';
import VideoComponent from '@/pages/generalFunctions';
import { setBookmarkData } from '../../../shared/services/Front_Apis/homePage/homePageCrud';
import { getBlogsBookmarksData } from '@/shared/services/Front_Apis/homePage/homePageCrud';
import { getFrontBlogs } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud'
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';
import { setSavedBlogsData } from "@/shared/services/Front_Apis/account/accountCrud.js";


function Homepage() {
  const [blogPostData, setBlogPostData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [sliderData, setSliderData] = useState([]);
  const [generalConfigData, setGeneralConfigData] = useState();
  const [abouts, setAboutData] = useState("");
  const [chatData, setChatData] = useState("");
  const [checkBookmarked, setCheckBookmarked] = useState(false);
  const [blogsBookmarkData, setBlogsBookmarkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState("");

  const router = useRouter();
  const grecaptchaObject = window.grecaptcha;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);
  const [chatMsgSuccesfull, setchatMsgSuccesfull] = useState();
  const [apiResponse, setApiResponse] = useState("success");

  let navigate = useRouter();
  const bookMarkData = useSelector((state) => state?.bookmarkData);
  const access_token = useSelector((state) => state?.frontEndUserData?.access_token);


  const dispatch = useDispatch(); // Get the dispatch function
  const primaryThemeColor = generalConfigData?.primary_theme_color;
  const secondaryThemeColor = generalConfigData?.secondary_theme_color;
  const primaryButtonsColor = generalConfigData?.primary_button_color;
  const secondaryButtonsColor = generalConfigData?.secondary_button_color
  const fontColor = generalConfigData?.font_color;


  const chatDataWithLogin = useSelector((state) => state?.frontEndUserData);
  const UserData = useSelector((state) => state?.frontEndUserData);



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
  }, [])

  const initialValues = {
    Name: chatDataWithLogin ? chatDataWithLogin.userData?.first_name : '',
    email: chatDataWithLogin ? chatDataWithLogin?.userData?.email : '',
    MessageText: '',
    captcha_token: '',
  };


  const HomeChatSchema = Yup.object().shape({
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
      .required("Message is required")
      .test(
        "no-leading-trailing-spaces",
        "Message cannot start or end with white spaces",
        (value) => {
          if (value) {
            const trimmedValue = value.trim();
            return trimmedValue === value; // Check if the input has leading/trailing white spaces
          }
          return true; // Allow empty input
        }
      ),
    captcha_token: Yup.string().required("You must verify the captcha"),
  });


  const ChatSchemaWithLogin = Yup.object().shape({
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
      .required("Message is required")
      .test(
        "no-leading-trailing-spaces",
        "Message cannot start or end with white spaces",
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
    validationSchema: chatDataWithLogin?.access_token ? ChatSchemaWithLogin : HomeChatSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      if (chatDataWithLogin?.access_token) {
        sendChatWithLogin(chatDataWithLogin?.access_token, values.Name, chatDataWithLogin?.userData?.email, values.MessageText)
          .then(({ data }) => {
            setApiResponse("success")
            // setTimeout(() =>{
            setchatMsgSuccesfull(true)
            // }, 1000)
          })
          .catch((error) => {
            setApiResponse("error")
            setchatMsgSuccesfull(true);

            if (error?.response?.data?.statusCode === 401) {
              dispatch(setFrontEndUserData([]));
              let path = `/account/login`;
              navigate.push(path);
            }
          })
          .finally(() => {
            setTimeout(() => {
              setchatMsgSuccesfull(false)
            }, 3500);
            setSubmitting(false);
            formik.resetForm();
            setLoading(false)
          })

      } else {
        sendChat(values.Name, values.email, values.MessageText, values.captcha_token)
          .then(({ data }) => {
            setApiResponse("success")
            // setTimeout(() =>{
            setchatMsgSuccesfull(true)
            // }, 1000)
          })
          .catch((error) => {
            setApiResponse("error")
            // setTimeout(() =>{
            setchatMsgSuccesfull(true)
            // }, 1000)
          })
          .finally(() => {
            setTimeout(() => {
              setchatMsgSuccesfull(false)
            }, 3500);
            setSubmitting(false);
            formik.resetForm();
            setLoading(false)
          })
      }
    },
  });


  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .font-color{
        color: ${fontColor} !important;
      }
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
      `;
    document.head.appendChild(style);
  }, [generalConfigData]);

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

  const getHomePageData = () => {
    getHomePage()
      .then(({ data }) => {
        setBlogPostData(data.blogPostData);
        setCategoryData(data.categoryData);
        setNewsData(data.newsData);
        setAboutData(data.homeBlockConfiguration)
        setChatData(data.chatBlockConfiguration)
        setSliderData(data?.sliderData);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getBlogBookmarkData = () => {
    const page = 1;
    const pageSize = 10; // Adjust based on your items per page
    const sortBy = "createdAt";
    const sortOrder = "DESC";

    getBlogsBookmarksData(access_token, page, pageSize, sortBy, sortOrder, false)
      .then(({ data }) => {
        setBlogsBookmarkData(data)
      })
      .catch((error) => {
        console.log(error);
      })

  }

  useEffect(() => {
    getHomePageData();
    getGeneralConfigData();
    getBlogBookmarkData();
  }, [])


  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: blogPostData?.length > 4 ? true : false,
    centerPadding: blogPostData?.length > 4 ? '-100px' : '0',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerPadding: '0px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0px',
        }
      }
    ]
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  const handleShowBlogs = () => {
    let path = `/blog`;
    router.push(path);
  }
  const handleShowNews = () => {
    let path = `/news`;
    router.push(path);
  }


  const isBookmarked = (item) => {
    return bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === item?.id && bookmark?.bookmarked);
  };

  const setBookmarkData = (blogposts) => {
    const isBookmarked = bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === blogposts?.id && bookmark?.bookmarked);
    if (access_token) {
      setSavedBlogsData(access_token, UserData?.userData?.id, blogposts?.id, isBookmarked ? false : true)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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

  const handleSelectedCategorie = (selectedCategorie) => {
    const { category_id, category_title } = selectedCategorie;
    localStorage.setItem('homePageSelectedCategory', JSON.stringify({ value: category_id, label: category_title }));
    router.push('/search')
  }



  useEffect(() => {
    getBlogBookmarkData()
  }, [])
  return (
    <>

      <Seo title={"Home Page"} />
      <div className='tan-block'>
        <Header />
        <div className='float-left w-100 home_carousel'>
          <Carousel>
            {sliderData &&
              sliderData.map((data, index) => (
                <Carousel.Item key={index}>
                  <Carousel.Caption>
                    <div>
                      <img
                        src={data?.media}
                        className="d-block w-100"
                        alt="slide"
                      />
                      <div className={`w-100 slide_caption d-flex ${data?.text_button_alignment === "left" ? "justify-content-start" : data?.text_button_alignment === "right" ? "justify-content-end" : "justify-content-center"}`}>
                        <div className={`slide_caption_data ${data?.text_button_alignment === "center" ? "text-center max_width_forCenterSlider" : "text-start max-width-forLeftRightSlider"}`}>
                          <h3 className='tx-md-50 tx-24 tx-sm-26 tx-md-30 text-capitalize'>{data?.header_text}</h3>
                          <div className='text-capitalize' dangerouslySetInnerHTML={{ __html: data?.sub_text }} />
                          <div className="slide_button">
                            {data?.parsedButton?.length > 0 && data?.parsedButton[0]?.name ?
                              <>
                                <Link className="btn primaryButtonColor text-white tx-18 br-6 me-4 tx-normal mb-3  mt-2" href={data?.parsedButton[0]?.url}>
                                  {data?.parsedButton[0]?.name}
                                </Link>
                              </>
                              : null}
                            {data?.parsedButton?.length > 1 && data?.parsedButton[0]?.name ? (
                              <>
                                <Link className="btn secondaryButtonColor text-dark tx-18 br-6 me-4 tx-normal mb-3  mt-2" href={data?.parsedButton[1]?.url}>
                                  {data?.parsedButton[1]?.name}
                                </Link>
                              </>
                            ) : null}
                            {data?.parsedButton?.length > 2 && data?.parsedButton[0]?.name ? (
                              <>
                                <Link className="btn primaryButtonColor text-white tx-18 br-6 me-4 tx-normal mb-3  mt-2" href={data?.parsedButton[2]?.url}>
                                  {data?.parsedButton[2]?.name}
                                </Link>
                              </>
                            ) : null}

                          </div>
                        </div>
                      </div>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
          </Carousel>
        </div>


        {/* categories */}
        <div className='primaryThemeColor  float-left w-100 pb-3 pb-lg-5'>
          <div>
            <h4 className='tx-lg-42 tx-24 tx-sm-30 text-center pt-5 mt-2 mb-3 mb-lg-5  font-color'>Explore categories (if needed)</h4>
          </div>

          <div className='mb-2'>
            <Container>
              <Row>
                {categoryData?.length >= 1 ?
                  <Col sm={12} md={6} lg={6} className='mb-4 mb-md-0'>
                    <span className='cursor-pointer' onClick={() => handleSelectedCategorie(categoryData[0])} >
                      <div className='left_categories position-relative h-100 '>
                        <div className='overlay'></div>
                        <img src={categoryData[0]?.category_image_url} alt="categories_img" />
                        <span className='position-absolute tx-24 tx-lg-35 tx-xl-42 text-capitalize' >{categoryData[0]?.category_title}</span>
                      </div>
                    </span>
                  </Col>
                  :
                  <Col sm={12} className='mb-4 mb-md-0'>
                    <div className='text-center'>
                      <h2 className='font-color'>Don't have any categories</h2>
                    </div>
                  </Col>
                }

                {categoryData?.length >= 2 ?
                  <Col sm={12} md={6} lg={6} >
                    <Row className='h-100'>
                      {categoryData.length === 2 ?
                        <Col sm={12} md={12} lg={12}>
                          <span className='cursor-pointer' onClick={() => handleSelectedCategorie(categoryData[1])}>
                            <div className='left_categories position-relative h-100'>
                              <div className='overlay'></div>
                              <img src={categoryData[1]?.category_image_url} alt="categories_img" className='h-100' />
                              <span className='position-absolute tx-24 tx-lg-35 tx-xl-42 text-capitalize' >{categoryData[1]?.category_title}</span>
                            </div>
                          </span>
                        </Col>
                        : null}
                      {categoryData.length > 2 ?
                        <>
                          <Col sm={12} md={12} lg={12} className='mb-4'>
                            <span className='cursor-pointer' onClick={() => handleSelectedCategorie(categoryData[1])}>
                              <div className='right_categories position-relative'>
                                <div className='overlay'></div>
                                <img src={categoryData[1]?.category_image_url} alt="categories_img" />
                                <span className='position-absolute tx-24 tx-lg-35 tx-xl-42 text-capitalize' >{categoryData[1]?.category_title}</span>
                              </div>
                            </span>
                          </Col>
                          <Col sm={12} md={12} lg={12}>
                            <span className='cursor-pointer' onClick={() => handleSelectedCategorie(categoryData[2])}>
                              <div className='right_categories position-relative' >
                                <div className='overlay'></div>
                                <img src={categoryData[2]?.category_image_url} alt="categories_img" />
                                <span className='position-absolute tx-24 tx-lg-35 tx-xl-42 text-capitalize ' >{categoryData[2]?.category_title}</span>
                              </div>
                            </span>
                          </Col>
                        </>
                        : null}
                    </Row>
                  </Col>
                  :
                  null}
              </Row>
            </Container>
          </div>
        </div>


        {/* About */}
        {abouts ? (
          <div className='secondaryThemeColor about_data pt-2 pt-lg-5 float-left w-100 pb-3 pb-lg-5'>
            <Container>
              <Row className='mt-3 mx-0 pb-3'>

                <>
                  <Col sm={12} md={12} lg={12} xl={6} className='order-lg-0 order-1'>
                    <div className='about_img float-xl-right h-100'>
                      <img src={abouts?.media} alt="about_img" />
                    </div>
                  </Col>
                  <Col sm={12} md={12} lg={12} xl={6} className='d-flex mt-3 mt-xl-0'>
                    <div className='about_right_data ms-xl-5 ps-xl-3'>
                      <span className='d-inline-block  text-uppercase tx-12 abtTag font-color'>ABOUT</span>
                      <p className='tx-40  ln_1_2 tx-normal  mt-2 pt-1 font-color'>{abouts?.header_text}</p>
                      {/* <p className='tx-17 aboutSubTextScrool mt-3'>{abouts?.sub_text}</p> */}
                      <div className='tx-17 aboutSubTextScrool mt-3 font-color' dangerouslySetInnerHTML={{ __html: abouts?.sub_text }} />

                      <div className='mt-3'>
                        {abouts?.parsedButton[0].button_name !== "" ?
                          <div className='slide_button about_btn'>
                            <Link href={abouts?.parsedButton[0]?.button_url}>
                              <button className="btn background-color-1 text-white tx-18 br-6 tx-normal mb-md-3 mb-sm-3 mb-xs-3 mb-lg-0">
                                {abouts?.parsedButton[0]?.button_name}
                              </button>
                            </Link>
                          </div>
                          : null}
                      </div>
                    </div>
                  </Col>
                </>
              </Row>
            </Container>
          </div>
        ) : null}

        {/* courses */}
        <div className='course primaryThemeColor  float-left w-100 pt-3 pt-lg-5 pb-3 pb-lg-4'>
          <div className='course_header pt-3 pb-4 mb-3 '>
            <Container>
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <div>
                    <h3 className='tx-lg-48 tx-26 tx-sm-30 font-color'>Popular courses</h3>
                  </div>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <div className='slide_button blue_coures float-right'>
                    <button className="btn primaryButtonColor font-color tx-18 br-6  tx-normal" onClick={handleShowBlogs}>
                      View all courses
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>



          <Container>

            {blogPostData?.length > 4 ? (
              <div className='courses_slider'>
                <link
                  rel="stylesheet"
                  type="text/css"
                  charSet="UTF-8"
                  href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
                />
                <link
                  rel="stylesheet"
                  type="text/css"
                  href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
                />
                <Slider {...settings}>

                  {blogPostData &&
                    blogPostData.map((data, index) => (
                      <Row>
                        <Col
                          key={index}
                          className="h-auto mt-4"
                        >
                          <Card className="card custom-card  h-100">
                            {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                              <div>
                                {data?.parsedBanner.length > 0 ?
                                  <>
                                    {data?.parsedBanner[0].type === "blog_image" ? (
                                      <img
                                        className="blog-img-front w-100 position-relative"
                                        src={data?.parsedBanner[0]?.Location}
                                        alt={data?.title}
                                      />
                                    ) : (
                                      null
                                    )}
                                    <>
                                      {data?.parsedBanner[0].type === "blog_video" ? (
                                        <VideoComponent videoSrc={data?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={data?.parsedBanner[0]?.video_duration} styling={`blog-img-front`} />

                                      ) : (
                                        null
                                      )}
                                    </>
                                  </>
                                  :
                                  <div
                                    className="blog-img-front w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                                  >
                                    <h1> No image</h1>
                                  </div>
                                }

                              </div>
                            </Link>

                            <Card.Body className="d-flex flex-column justify-content-between">
                              {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                                <div className="d-flex">
                                  {data?.content_type === "paid" && ( // Check content_type and conditionally render the premium badge
                                    <div className="premium-badge">
                                      <span className="text-dark">
                                        <i className="mdi mdi-approval tx-13 me-1"></i>
                                        <span className='tx-12 tx-bold'>Premium</span>
                                      </span>
                                    </div>
                                  )}
                                  <div className={`news_tag background-color-2  tx-12 text-capitalize ${data?.content_type === "paid" ? 'ms-2' : null}`}>
                                    <span className="d-inline-block text-color-2 blue-white text-capitalize tx-12 tx-bold">
                                      {data?.category.title}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                  <span className="m-0">{data?.user?.first_name}</span>
                                  <i className="fa fa-circle tx-6 mx-2"></i>
                                  <span className="text-muted">
                                    {formatDate(data?.createdAt)}
                                  </span>
                                </div>

                                <div className="mt-2">
                                  <h4 className="card-title m-0 tx-12 text-color-2 tx-24">
                                    {data?.title}
                                  </h4>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                  <span className="m-0 tx-17 text-color-3">
                                    {data?.short_description}
                                  </span>
                                </div>
                              </Link>
                              {access_token ?
                                <div className=''>
                                  <button className="btn p-0 float-right bookmark_btn" onClick={() => handleBookmark(data)}>
                                    <img src={isBookmarked(data) ? "../../../assets/img/front/FilledBookmark2.png" : "../../../assets/img/front/bookmark.png"} alt="bookmark" />
                                  </button>
                                </div>
                                : null}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    ))}

                </Slider>
              </div>
            ) : (
              <>
                <Row>
                  {blogPostData &&
                    blogPostData.map((data) => (
                      <>
                        <Col
                          md={4}
                          lg={3}
                          className="h-auto mt-4"
                        >
                          <Card className="card custom-card  h-100">
                            {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                              <div>
                                {data?.parsedBanner.length > 0 ?
                                  <>
                                    {data?.parsedBanner[0].type === "blog_image" ? (
                                      <img
                                        className="blog-img-front w-100 position-relative"
                                        src={data?.parsedBanner[0]?.Location}
                                        alt={data?.title}
                                      />
                                    ) : (
                                      null
                                    )}
                                    <>
                                      {data?.parsedBanner[0].type === "blog_video" ? (
                                        <VideoComponent videoSrc={data?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={data?.parsedBanner[0]?.video_duration} styling={`blog-img-front`} />

                                      ) : (
                                        null
                                      )}
                                    </>
                                  </>
                                  :
                                  <div
                                    className="blog-img-front w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                                  >
                                    <h1> No image</h1>
                                  </div>
                                }

                              </div>
                            </Link>

                            <Card.Body className="d-flex flex-column justify-content-between">
                              {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                                <div className="d-flex">
                                  {data?.content_type === "paid" && ( // Check content_type and conditionally render the premium badge
                                    <div className="premium-badge">
                                      <span className="text-dark">
                                        <i className="mdi mdi-approval tx-13 me-1"></i>
                                        <span className='tx-12 tx-bold'>Premium</span>
                                      </span>
                                    </div>
                                  )}
                                  <div className={`news_tag background-color-2  tx-12 text-capitalize  ${data?.content_type === "paid" ? 'ms-2' : null}`}>
                                    <span className="d-inline-block text-color-2 blue-white text-capitalize tx-12 tx-bold">
                                      {data?.category.title}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                  <span className="m-0">{data?.user?.first_name}</span>
                                  <i className="fa fa-circle tx-6 mx-2"></i>
                                  <span className="text-muted">
                                    {formatDate(data?.createdAt)}
                                  </span>
                                </div>

                                <div className="mt-2">
                                  <h4 className="card-title m-0 tx-12 text-color-2 tx-24">
                                    {data?.title}
                                  </h4>
                                </div>
                                <div className="text-muted d-flex align-items-center mt-2">
                                  <span className="m-0 tx-17 text-color-3">
                                    {data?.short_description}
                                  </span>
                                </div>
                              </Link>
                              {access_token ?
                                <div className=''>
                                  <button className="btn p-0 float-right bookmark_btn" onClick={() => handleBookmark(data)}>
                                    <img src={isBookmarked(data) ? "../../../assets/img/front/FilledBookmark2.png" : "../../../assets/img/front/bookmark.png"} alt="bookmark" />
                                  </button>
                                </div>
                                : null}
                            </Card.Body>
                          </Card>
                        </Col>

                      </>
                    ))}
                </Row>
              </>
            )
            }
            {blogPostData?.length === 0 ?
              <Row>
                <Col sm={12}>
                  <div className='text-center font-color'>
                    <h2>Don't have any blogs</h2>
                  </div>
                </Col>
              </Row>
              : null}

          </Container>

        </div>

        {/* news */}
        <div className='secondaryThemeColor news_data pt-5 float-left w-100'>
          <div className='course_header pt-3 pb-4 mb-3 '>
            <Container>
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <div>
                    <h3 className='tx-lg-48 tx-26 tx-sm-30 font-color'>In the news</h3>
                  </div>
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <div className='slide_button float-right'>
                    <button className="btn secondaryButtonColor font-color tx-18 br-6  tx-normal" onClick={handleShowNews}>
                      View all news
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          <div className='home_news_div mb-3'>
            <Container>
              <Row>
                {newsData &&
                  newsData.slice(0, 4).map((data, index) => (
                    <Col sm={12} md={12} lg={12} xl={6} key={index} className="mb-5">
                      <div key={index} className='news_card h-100 m-0'>
                        <Card className="flex-column flex-sm-row shadow-none h-100 m-0">

                          {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                            {data?.parsedBanner.length > 0 ?
                              <>
                                {data?.parsedBanner[0].type === "blog_image" ? (
                                  <img
                                    className="news-card-img w-100 position-relative"
                                    src={data?.parsedBanner[0]?.Location}
                                    alt={data?.title}
                                  />
                                ) : (
                                  null
                                )}
                                <>
                                  {data?.parsedBanner[0].type === "blog_video" ? (
                                    <VideoComponent videoSrc={data?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={data?.parsedBanner[0]?.video_duration} styling={`news-card-img`} />
                                  ) : (
                                    null
                                  )}
                                </>
                              </>
                              :
                              <div
                                className="news-card-img w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                              >
                                <h1> No image</h1>
                              </div>
                            }
                          </Link>

                          <Card.Body className='news_data position-relative'>
                            {/* <Link href={data?.content_type === "paid" ? '/profile/subscription-plan' : '/blog/blog-detail'} onClick={() => handleEditData(data)}> */}
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
                              <div className="d-flex">
                                {data?.content_type === "paid" && ( // Check content_type and conditionally render the premium badge
                                  <div className="premium-badge">
                                    <span className="text-dark">
                                      <i className="mdi mdi-approval tx-13 me-1"></i>
                                      <span className='tx-12 tx-bold'>Premium</span>
                                    </span>
                                  </div>
                                )}
                                <div className={`news_tag background-color-2  tx-12 text-capitalize ${data?.content_type === "paid" ? 'ms-2' : null}`}>
                                  <span className="d-inline-block text-color-2 blue-white text-capitalize tx-12 tx-bold">
                                    {data?.category.title}
                                  </span>
                                </div>
                              </div>
                              <p className='tx-16  my-2'>{data?.user?.first_name} • {formatDate(data?.createdAt)}</p>
                              <p className='tx-20  m-0'>{data?.title}</p>
                            </Link>
                            {access_token ?
                              <button className="btn p-0 float-right bookmark_btn" onClick={() => handleBookmark(data)}>
                                <img src={isBookmarked(data) ? "../../../assets/img/front/FilledBookmark2.png" : "../../../assets/img/front/bookmark.png"} alt="bookmark" />
                              </button>
                              : null}
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  ))}
              </Row>
              {newsData?.length === 0 ?
                <Row>
                  <Col sm={12}>
                    <div className='text-center font-color'>
                      <h2>Don't have any News</h2>
                    </div>
                  </Col>
                </Row>
                : null}
            </Container>
          </div>

        </div>

        {/* collaborator */}
        {chatData ? (
          <div className='primaryThemeColor collborator float-left w-100'>
            <div>
              <Container fluid>
                <Row>
                  <Col sm={12} md={12} lg={5} className=' ps-lg-0 pt-4 pt-lg-0 text-center'>
                    <img
                      src={chatData?.media}
                      className="float-none float-lg-right"
                      alt="collaborate"
                    />
                  </Col>

                  <Col sm={12} md={12} lg={7} className='pb-4 pb-lg-0 mt-4 mt-lg-0 ps-2'>
                    <div className='d-flex align-items-center justify-content-center h-100 collab_data_text'>
                      <div className='blue-white collab_data'>
                        <p className='tx-lg-42 tx-md-35 tx-26 tx-normal lh-2 font-color'>{chatData?.header_text}</p>
                        <span className='tx-17 tx-normal  font-color'>{chatData?.sub_text}</span>

                        <Row className='collaborate_form my-3'>
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
                                    {chatDataWithLogin?.access_token ?
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
                                      :
                                      <Form.Control
                                        className="form-control"
                                        placeholder="Enter your email"
                                        type="text"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                    }
                                    {formik.errors.email && formik.touched.email && (
                                      <div className="text-danger">{formik.errors.email}</div>
                                    )}
                                  </Form.Group>
                                </Col>

                              </Row>
                              <Row>
                                <Col sm={12} md={12} lg={12}>
                                  <div className="">
                                    <textarea className="form-control" placeholder="Message" id="floatingTextarea" name="MessageText"
                                      value={formik.values.MessageText}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur} />
                                    {formik.errors.MessageText && formik.touched.MessageText && (
                                      <div className="text-danger">{formik.errors.MessageText}</div>
                                    )}
                                    <label htmlFor="floatingTextarea"></label>
                                  </div>


                                </Col>
                                {chatDataWithLogin?.access_token ? null :
                                  <Col className='mt-3'>
                                    <ReCAPTCHA
                                      ref={captchaRef}
                                      name="captcha_token"
                                      sitekey={siteKey}
                                      onChange={(captcha_token) =>
                                        formik.setFieldValue("captcha_token", captcha_token)
                                      }
                                      onReset={() => formik.setFieldValue("captcha_token", "")}
                                      onExpired={() => formik.setFieldValue("captcha_token", "")}
                                      grecaptcha={grecaptchaObject}
                                      className="captcha-shadow"
                                    />
                                    {formik.touched.captcha_token && formik.errors.captcha_token ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block text-danger">
                                          {formik.errors.captcha_token}
                                        </div>
                                      </div>
                                    ) : null}

                                  </Col>
                                }
                              </Row>
                              <div>
                                <p className='tx-17 my-3 tx-normal required_text font-color'>*All fields are required</p>
                              </div>

                              <Button variant="" id="submitButton" className={`btn primaryButtonColor font-color tx-18 ${loading ? 'disabled' : null}`} type="submit">
                                {loading ?
                                  <Spinner animation="border"
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </Spinner>
                                  : "Submit"}
                                {/* <span>Submit</span> */}
                              </Button>

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
                                        Chat Sent Successfully
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
                                        Chat Sent Error
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
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        ) : null}





        <Footer />
      </div >
    </>
  );
}

export default Homepage;
