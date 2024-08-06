import React, { useEffect } from 'react';
import Seo from "@/shared/layout-components/seo/seo";
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';
import { useState } from 'react'
import Link from "next/link";
import { Container, Row, Col, Card, FormGroup, Button } from 'react-bootstrap';
import Select from "react-select";
import { getFrontBlogs, getAllTags, getCategories } from '../../../shared/services/Front_Apis/blogPage/blogPageCrud'
import { setBookmark } from "@/shared/redux/actions/authAction";
import { getNewsData, setSavedBlogsData } from "@/shared/services/Front_Apis/account/accountCrud.js";
import Header from '../header'
import Footer from '../footer'
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { useDispatch, useSelector } from 'react-redux'; // Import the useDispatch hook
import VideoComponent from '@/pages/generalFunctions';
import { useRouter } from 'next/router';

function NewsBlogPage() {
    // const [categories, setCategories] = useState([]);
    const [categories, setCategories] = useState([{ value: '', label: 'All' }]);
    const [selectedCategorie, setSelectedCategorie] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [totalBlogs, setTotlaBlogs] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [search, setSearch] = useState("")
    const [sliderData, setSliderData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [generalConfigData, setGeneralConfigData] = useState();
    const [profile, setProfile] = useState("");
    const [totalSavedBLogs, setTotalSaveBlogs] = useState(null)
    const [loading, setLoading] = useState(true)
    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const userID = useSelector((state) => state?.frontEndUserData?.userData?.id);

    useEffect(() => {
        getCategories()
            .then(({ data }) => {
                const categoryOptions = data.map((category) => ({
                    value: category.id,
                    label: category.title,
                }));
                setCategories([{ value: '', label: 'All' }, ...categoryOptions]);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

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
        profileData();
    }, [])

    const resetSearchAndFilter = () => {
        setSearch("")
        setSearchValue("")
        setSelectedTags(null);
        setSelectedCategorie(null)
    }

    const itemsPerPage = 9;
    const dispatch = useDispatch();
    let navigate = useRouter();

    const primaryThemeColor = generalConfigData?.primary_theme_color;

    const getBlog = () => {
        const page = currentPage;
        const pageSize = itemsPerPage; // Adjust based on your items per page
        const sortBy = "createdAt";
        const sortOrder = "DESC";
        const post_type = "news";
        const selectedTagValues = selectedTags ? selectedTags.map(tag => tag.value) : [];
        const selectedCategoryValue = selectedCategorie
            ? selectedCategorie.value
            : null; // Extract the value
        const encodedTags = encodeURIComponent(JSON.stringify(selectedTagValues))


        getFrontBlogs(page, pageSize, sortBy, sortOrder, post_type, search, encodedTags, selectedCategoryValue)
            .then(({ data }) => {
                if (page > 1) {
                    setTotlaBlogs(data.total);
                    setBlogs((prevBlogs) => [...prevBlogs, ...data.blogsData]);
                    setSliderData(data.sliderData)
                    setLoading(false);
                } else {
                    // If not loading more data, set the data as usual
                    setTotlaBlogs(data.total);
                    setBlogs([...data?.blogsData]);
                    setSliderData(data.sliderData)
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error?.message !== "canceled") {

                    setLoading(false);
                }
            })
    }
    const getTags = () => {
        getAllTags()
            .then(({ data }) => {
                const tagsOptions = data?.tagsData.map((tags) => ({
                    value: tags.id,
                    label: tags.name,
                }));
                setTags(tagsOptions);

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

        if (accessToken) {
            getNewsData(accessToken, page, pageSize, sortBy, sortOrder, false)
                .then(({ data }) => {
                    dispatch(setBookmark(data?.savedBlogsData));

                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    useEffect(() => {
        getBlogItem();
        getBlog();
        getTags();
    }, [])

    useEffect(() => {
        if (searchValue === "") {
            setSearch("")
        }
    }, [searchValue])

    const handleSearchChange = (e) => {
        const inputValue = e.target.value;

        // Check if the input starts with one or more spaces
        if (inputValue.match(/^\s+/)) {
            // If it starts with spaces, remove them
            const trimmedValue = inputValue.trimStart();
            setSearchValue(trimmedValue);
        } else {
            setSearchValue(inputValue);
        }
    };

    const handleSearch = () => {
        // Trim the search input value to remove leading and trailing spaces
        const trimmedSearchValue = searchValue.trim();
        setSearch(trimmedSearchValue); // Set the trimmed search value
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default behavior (e.g., form submission)
            handleSearch(); // Trigger the search when Enter key is pressed
        }
    }

    const clearSearch = () => {
        setSearchValue(""); // Clear the search input value
        setSearch(""); // Clear the search state
    };

    const handleViewMore = () => {
        setCurrentPage(currentPage + 1)
    }

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    useEffect(() => {
        setCurrentPage(1)
        getBlog();
    }, [search, selectedTags, selectedCategorie])
    useEffect(() => {
        getBlog();
    }, [currentPage])

    const handleSelectChange = (selectedOptions) => {
        setSelectedTags(selectedOptions); // Update the selected tags
    };
    const handleSelectCategory = (selectedOptions) => {
        setSelectedCategorie(selectedOptions); // Update the selected tags
    };

    const dynamicStyles = sliderData?.media
        ? {
            backgroundImage: `url(${sliderData?.media})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }
        : {
            backgroundColor: primaryThemeColor,
        };


    const bookMarkData = useSelector((state) => state?.bookmarkData);
    console.log("bookMarkData---------------", bookMarkData);


    useEffect(() => {
        setTotalSaveBlogs(bookMarkData?.length)

    }, [bookMarkData])
    const isBookmarked = (item) => {
        return bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === item?.id && bookmark?.bookmarked);
    };


    const setBookmarkData = (blogposts) => {
        const isBookmarked = bookMarkData?.some((bookmark) => bookmark?.blogposts?.id === blogposts?.id && bookmark?.bookmarked);
        if (accessToken) {
            setSavedBlogsData(accessToken, userID, blogposts?.id, isBookmarked ? false : true)
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

    useEffect(() => {
        const storedSearch = localStorage.getItem('newsPageSearch');
        const storedSelectedTags = localStorage.getItem('newsPageSelectedTags');
        const storedSelectedCategory = localStorage.getItem('newsPageSelectedCategory');

        if (storedSearch) setSearch(storedSearch);
        if (storedSearch) setSearchValue(storedSearch);
        if (storedSelectedTags) setSelectedTags(JSON.parse(storedSelectedTags));
        if (storedSelectedCategory) setSelectedCategorie(JSON.parse(storedSelectedCategory));
    }, []);

    // Save filter and search values to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('newsPageSearch', search);
        localStorage.setItem('newsPageSelectedTags', JSON.stringify(selectedTags));
        localStorage.setItem('newsPageSelectedCategory', JSON.stringify(selectedCategorie));
    }, [search, selectedTags, selectedCategorie]);

    return (

        // here we have 2 themes, class name is "news_listing1" and "news_listing2"
        <div className='news_listing2 page'>
            <Seo title={"News"} />
            <div>
                <Header />

                <div className='news_head_text' style={dynamicStyles}>
                    <Container>
                        <Row>
                            <Col>
                                <div className={` m-auto py-md-5 my-xl-3 py-3 ${sliderData?.text_button_alignment === "left" ? "text-start" : sliderData?.text_button_alignment === "right" ? 'text-end' : 'text-center'}`}>
                                    <span className='d-inline-block fontColor secondaryButtonColor blue-white-bg_small text-uppercase tx-12 tx-bold'>News</span>
                                    <p className={` tx-24 tx-lg-35 tx-xl-42 ${sliderData?.media ? 'text-white' : 'fontColor'}  ln_1_2 tx-normal mt-3 pt-1 text-capitalize`}>{sliderData?.header_text} </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <div className='flex-1'>
                {/* news filter */}
                <div className='secondaryThemeColor news_filter_div py-md-4 pt-3 pb-4'>
                    <Container>
                        <Row>
                            <Col sm={12} md={4} lg={3}>
                                <div>
                                    <span className="news_search">

                                        <input
                                            className="form-control search"
                                            placeholder="Search keyword"
                                            type="search"
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleSearchKeyDown}
                                        />
                                        {searchValue && ( // Conditional rendering of the clear icon
                                            <Button
                                                variant="link"
                                                className="btn search-btn clear-search-icon me-3 me-md-2"
                                                onClick={clearSearch}
                                            >
                                                <i className="fas fa-times"></i>
                                            </Button>
                                        )}
                                    </span>
                                </div>
                            </Col>
                            <Col sm={12} md={4} lg={5}>
                                <div className='news_select mt-3 mt-md-0'>
                                    <FormGroup className='w-100'>
                                        <Select
                                            classNamePrefix="selectform cursor-pointer"
                                            isMulti={true}
                                            options={tags}
                                            placeholder="Select Tag"
                                            noOptionsMessage={() => "No matching tag found"}
                                            value={selectedTags}
                                            onChange={handleSelectChange}
                                        />
                                    </FormGroup>
                                </div>
                            </Col>
                            <Col sm={12} md={4} lg={4}>
                                <FormGroup className='w-100 mt-3 mt-md-0'>
                                    <Select
                                        classNamePrefix="selectform cursor-pointer"
                                        isMulti={false}
                                        options={categories}
                                        placeholder="Select category"
                                        noOptionsMessage={() => "No matching category found"}
                                        value={selectedCategorie}
                                        onChange={handleSelectCategory}
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                    </Container>
                </div>

                {/* new main content */}
                <div className='secondaryThemeColor pb-5'>
                    <Container>
                        <Row className="pt-3">
                            {blogs.length !== 0 ?
                                <>
                                    {blogs?.map((data, index) => (
                                        <Col sm={12} md={6} lg={4} key={index} className="mb-3">
                                            <div className='news_card_data shadow-none h-100 bookmarkCardForNews'>

                                                <Card className="card custom-card card-img-top-1 h-100 shadow-none ">
                                                    <Link
                                                        className='position-relative'
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
                                                        <div className='news_c_image'>
                                                            {data?.parsedBanner?.length > 0 ?
                                                                <>
                                                                    {data?.parsedBanner[0]?.type === "blog_image" ? (
                                                                        <img
                                                                            className="blog-img-front w-100 position-relative"
                                                                            src={data?.parsedBanner[0]?.Location}
                                                                            alt={data?.title}
                                                                        />
                                                                    ) : (
                                                                        null
                                                                    )}
                                                                    <>
                                                                        {data?.parsedBanner[0]?.type === "blog_video" ? (
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

                                                        <Card.Body className="pb-0">

                                                            <div className="d-flex">
                                                                {data?.content_type === "paid" && ( // Check content_type and conditionally render the premium badge
                                                                    <div className="premium-badge">
                                                                        <span className="text-dark">
                                                                            <i className="mdi mdi-approval tx-13 me-1"></i>
                                                                            <span className='tx-12 tx-bold'>Premium</span>
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className={`category_badge ${data?.content_type === "paid" ? 'ms-2' : null}`}>
                                                                    <span className="d-inline-block text-color-2 blue-white text-capitalize tx-12 tx-bold">
                                                                        {data?.category.title}
                                                                    </span>
                                                                </div>

                                                            </div>


                                                            <div className="text-muted d-flex align-items-center mt-2">
                                                                <span className="m-0 text-color-4 tx-16">{data?.user.first_name}</span>
                                                                <i className="fa fa-circle tx-6 mx-2"></i>
                                                                <span className="m-0 text-color-4 tx-16">
                                                                    {formatDate(data?.createdAt)}
                                                                </span>
                                                            </div>

                                                            <div className="mt-2">
                                                                <h4 className="card-title m-0 tx-12 text-color-2 tx-24">
                                                                    {data?.title && data.title.length > 25
                                                                        ? data.title.substring(0, 25) + '...'
                                                                        : data?.title}
                                                                </h4>
                                                            </div>
                                                            <div className="text-muted d-flex align-items-center mt-2">
                                                                <span className="m-0 tx-17 text-color-3">
                                                                    {data?.short_description && data.short_description.length > 130
                                                                        ? data.short_description.substring(0, 130) + '...'
                                                                        : data?.short_description}
                                                                </span>
                                                            </div>
                                                            <div className='mt-2 pb-3'>

                                                                <span
                                                                    className='text-color-5 tx-bold tx-18'
                                                                >
                                                                    Read Post
                                                                    <i className="fa fa-arrow-right tx-12 ms-2"></i></span>
                                                            </div>



                                                        </Card.Body>
                                                    </Link>
                                                </Card>
                                                {accessToken ?

                                                    <div className='bookmarkDivForNews'>
                                                        <button className="btn p-0 float-right bookmark_btn" onClick={() => handleBookmark(data)}>
                                                            <img src={isBookmarked(data) ? "../../../assets/img/front/FilledBookmark2.png" : "../../../assets/img/front/bookmark.png"} alt="bookmark" />
                                                        </button>
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        </Col>

                                    ))
                                    }
                                </>
                                :
                                <>
                                    <Col>
                                        <Row className="justify-content-center">
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
                                                <Card>
                                                    <div className="mt-2">
                                                        <div className="px-5 pb-5">
                                                            <div className="text-center">
                                                                <i className="mdi mdi-alert-circle-outline w-100 text-center tx-100"></i>
                                                            </div>
                                                            {searchValue ? (
                                                                <>
                                                                    <div className="text-center empty-state__help">Don't have any News matching with your search</div>
                                                                    <div className="text-center  mt-3">Reset search values to get all News </div>
                                                                    <div className='mt-3 text-center'>
                                                                        <Button
                                                                            variant="danger"
                                                                            className="btn tx-16 px-4"
                                                                            onClick={resetSearchAndFilter}
                                                                        >
                                                                            Reset

                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            ) : selectedTags && blogs.length === 0 ?
                                                                (
                                                                    <>
                                                                        <div className="text-center empty-state__help">Don't have any News matching with your tag</div>
                                                                        <div className="text-center  mt-3">Reset tag values to get all News </div>
                                                                        <div className='mt-3 text-center'>
                                                                            <Button
                                                                                variant="danger"
                                                                                className="btn tx-16 px-4"
                                                                                onClick={resetSearchAndFilter}
                                                                            >
                                                                                Reset

                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )
                                                                : selectedCategorie && blogs.length === 0 ?
                                                                    (
                                                                        <>
                                                                            <div className="text-center empty-state__help">Don't have any News matching with your category</div>
                                                                            <div className="text-center  mt-3">Reset category values to get all News </div>
                                                                            <div className='mt-3 text-center'>
                                                                                <Button
                                                                                    variant="danger"
                                                                                    className="btn tx-16 px-4"
                                                                                    onClick={resetSearchAndFilter}
                                                                                >
                                                                                    Reset

                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                    :
                                                                    <>
                                                                        <div className="text-center empty-state__help">Don't have any News</div>
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>
                                                </Card>
                                            }
                                        </Row>
                                    </Col>
                                </>
                            }
                        </Row>
                    </Container>
                    {
                        totalBlogs > itemsPerPage && totalBlogs > blogs.length ?
                            <div className="text-center mt-3 mb-5">
                                <button className="btn btn-primary tx-18 py-3 px-4 view_more_btn" onClick={handleViewMore}>
                                    View more <i className="fa fa-arrow-down tx-12 ms-2"></i>
                                </button>
                            </div>
                            : null
                    }


                </div>
            </div>
            <Footer />
        </div >
    )
}
export default NewsBlogPage;