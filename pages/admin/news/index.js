import { React, useState, useEffect, useRef } from "react";
import {
  Card,
  Col,
  Button,
  Row,
  Modal,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  Pagination
} from "react-bootstrap";
import Link from "next/link";
import Seo from "@/shared/layout-components/seo/seo";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getBlogs, deleteBlog, updateBlog } from "@/shared/services/Admin_Apis/blog-news/blogNewsCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData, setBlogAndNewsData, setCommentType } from "@/shared/redux/actions/authAction";
import { useRouter } from "next/router";
import VideoComponent from "@/pages/generalFunctions";

const News = () => {
  const [modalValue, setModalValue] = useState(""); // set modal value for activation modal
  const [authModal, setAuthModal] = useState(false); // Modal show hide state
  const [news, setBlogs] = useState([]);
  const [sendStatus, setSendStatus] = useState(null); // Default to status null
  const [edit, setEdit] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("")
  const [status, setStatusFilter] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [totalNews, setTotalNews] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch(); // Get the dispatch function
  let navigate = useRouter();
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalNews / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const getNews = () => {
    const page = currentPage;
    const pageSize = itemsPerPage; // Adjust based on your items per page

    const sortBy = "createdAt";
    const sortOrder = "DESC";
    const post_type = "news"
    getBlogs(accessToken, page, pageSize, sortBy, sortOrder, post_type, status, search)
      .then(({ data }) => {
        setBlogs(data.blogsData);
        setTotalNews(data.total)
      })
      .catch((error) => {
        toast.error(error?.response?.data?.description, {
          theme: "dark",
        });
        if (error?.response?.data?.statusCode === 401) {
          dispatch(setUserData(null));
          let path = `/admin/login`;
          navigate.push(path);
        }
      })
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getNews();
  }, [currentPage])

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const handleEdit = () => {
    updateBlog(
      accessToken,
      edit?.id,
      edit?.title,
      edit?.user_id,
      edit?.banner,
      edit?.category_id,
      edit?.content_type,
      edit?.long_description,
      edit?.parent_id,
      edit?.post_type,
      edit?.short_description,
      edit?.drafted,
      sendStatus === 1 ? 0 : 1
    )
      .then(({ data }) => {
        toast.success(data?.message, {
          theme: "dark",
        });

      })
      .catch((error) => {
        toast.error(error?.response?.data?.description, {
          theme: "dark",
        });
      })
      .finally(() => {
        setAuthModal(false);
        getNews();
      });
  };

  const accessToken = useSelector((state) => state?.userData?.access_token);


  useEffect(() => {
    getNews();
  }, [status, search]);



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

  // Function to handle the search
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

  const resetSearchAndFilter = () => {
    setSearchValue(""); // Clear the search input value
    setSearch(""); // Clear the search state
    setStatusFilter(null); // Clear the status filter
    setIsFilterActive(false);
  };



  /* Set modal value and show modal Function */
  const handleModal = (data, news) => {
    setSendStatus(news?.status);
    setEdit(news);
    setModalValue(data);
    setAuthModal(true);
  };
  /* Delete Modal function */
  function DeleteAlert(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ms-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete this blog?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteBlog(id, accessToken)
            .then(({ data }) => {
              toast.success(data?.message, {
                theme: "dark",
              });
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

            })
            .finally(() => {
              getNews();
            });
        }
      });
  }

  const handlePandingComents = (id) => {
    dispatch(setCommentType(id))
    let path = `/admin/comments`;
    navigate.push(path);
  }

  const handleEditData = (id) => {
    dispatch(setBlogAndNewsData(id))
  }

  return (
    <div className="pb-5">
      <Seo title={"News"} />


      <>
        {/* News title start */}
        <Card className="mt-4">
          <Card.Body className="py-0">
            <div className="breadcrumb-header justify-content-between">
              <div className="left-content">
                <span className="main-content-title mg-b-0 mg-b-lg-1">News</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* News title end */}



        <Row className="row-sm">
          <Col lg={12}>
            <Card className=" mg-b-20 shadow-search">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  {/* Search start */}
                  <Col md={6}>
                    <div className="main-content-label mb-0 ">
                      <Row>
                        <Col sm={9} className="mt-sm-2 mt-0">
                          <div className="main-header-center m-0 d-block form-group">
                            <input
                              className="form-control"
                              placeholder="Search..."
                              type="search"
                              value={searchValue}
                              // onChange={(e) => setSearchValue(e.target.value)}
                              onChange={handleSearchChange}
                              onKeyDown={handleSearchKeyDown}
                            />
                            {searchValue && ( // Conditional rendering of the clear icon
                              <Button
                                variant="link"
                                className="btn search-btn clear-search-icon me-5"
                                onClick={clearSearch}
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            )}
                            <Button variant="" className="btn search-btn" onClick={() => handleSearch(searchValue)}>

                              <i className="fas fa-search"></i>
                            </Button>
                          </div>
                        </Col>
                        <Col sm={2} className="mt-sm-2 mt-0">
                          <div>
                            {isFilterActive || searchValue ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-top`}>Reset</Tooltip>}
                              >
                                <Button
                                  variant="danger"
                                  className="btn tx-16 px-4"
                                  onClick={resetSearchAndFilter}
                                >
                                  Reset

                                </Button>
                              </OverlayTrigger>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                    </div>
                  </Col>
                  {/* Search end */}

                  {/* Filter, add category start */}
                  <Col md={6} className="mt-sm-2 mt-0">
                    <div className="d-flex justify-content-sm-end align-items-center justify-content-between">

                      {/* Filter start */}
                      <div ref={dropdownRef}>
                        <Dropdown
                          className={`dropdown nav-item ${isDropdownOpen ? 'show' : ''}`}
                          show={isDropdownOpen}
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-top`}>Filter</Tooltip>}
                          >
                            <Dropdown.Toggle
                              className="new nav-link position-relative"
                              href="#!"
                              variant=""
                              onClick={toggleDropdown}
                            >
                              <i className="fa fa-filter" aria-hidden="true"></i>
                            </Dropdown.Toggle>
                          </OverlayTrigger>

                          <Dropdown.Menu className="dropdown-center">
                            <div className="w-100">
                              <div className="main-message-list chat-scroll">
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 2 ? 'all' : ''}`}
                                  onClick={() => handleStatusFilterChange(null)}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">All</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 1 ? 'active' : ''}`}
                                  onClick={() => handleStatusFilterChange(1)}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Active</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 0 ? 'inactive' : ''}`}
                                  onClick={() => handleStatusFilterChange(0)}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Inactive</h5>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                        <div>

                        </div>
                      </div>
                      {/* Filter end */}

                      {/* Filter end */}

                      {/* Add category start */}
                      <div className="ms-4">
                        <Link
                          href="/admin/news/create-news"
                        >
                          <Button
                            className="btn btn-primary d-flex align-items-center"
                          >
                            <i className="si si-plus me-2 tx-15"></i>
                            <span className="tx-15">Add news</span>
                          </Button>
                        </Link>
                      </div>
                      {/* Add category end */}
                    </div>
                  </Col>
                  {/* Filter, add category end */}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* News post row start */}

        <Row>
          {news?.length > 0 ? (
            news.map((news) => (
              <Col
                xxl={3}
                xl={3}
                lg={4}
                md={6}
                sm={6}
                key={news?.id}
                className="h-auto mt-4"
              >
                <Card className="card custom-card card-img-top-1 h-100">
                  <div>
                    {news?.parsedBanner.length > 0 ?
                      <>
                        {news?.parsedBanner[0].type === "blog_image" ? (
                          <img
                            className="blog-img w-100 position-relative"
                            src={news?.parsedBanner[0]?.Location}
                            alt={news?.title}
                          />
                        ) : (
                          null
                        )}
                        <>
                          {news?.parsedBanner[0].type === "blog_video" ? (
                            <VideoComponent videoSrc={news?.parsedBanner[0]?.video_thumbnail?.Location} videoDuration={news?.parsedBanner[0]?.video_duration} styling={`blog-img`} />

                          ) : (
                            null
                          )}
                        </>
                      </>
                      :
                      <div
                        className="blog-img w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                      >
                        <h1> No image</h1>
                      </div>
                    }
                    {/* 
                    {news?.parsedBanner.length > 0 && news?.parsedBanner[0].type === "blog_image" ? (
                      <img
                        className="blog-img w-100 position-relative"
                        src={news?.parsedBanner[0]?.Location}
                        alt={news?.title}
                      />
                    ) : (
                      <div
                        className="blog-img w-100 position-relative d-flex justify-content-center align-items-center border-bottom"
                      >
                        <h1> No image</h1>
                      </div>
                    )} */}
                    <div className="Active-badge position-absolute">
                      <span
                        className={`text-${news?.status === 1 ? "success" : "danger"
                          } cursor-pointer tx-13`}
                        onClick={() => {
                          handleModal(
                            news?.status === 1 ? "Inactive" : "Active",
                            news
                          );
                        }}
                      >
                        <i
                          className={`fe ${news?.status === 1
                            ? "fe-check-circle"
                            : "fe-alert-octagon"
                            } tx-13 me-1`}
                        ></i>
                        <span>{news?.status === 1 ? "Active" : "Inactive"}</span>
                      </span>
                    </div>
                  </div>
                  <Card.Body className="pb-0 d-flex flex-column ">
                    <div className="d-flex">
                      {news?.content_type === "paid" && ( // Check content_type and conditionally render the premium badge
                        <div className="premium-badge">
                          <span className="text-dark">
                            <i className="mdi mdi-approval tx-13 me-1"></i>
                            <span>Premium</span>
                          </span>
                        </div>
                      )}
                      <div className={`category-badge ${news?.content_type === "paid" ? 'ms-2' : null}`}>
                        <span className="badge bg-primary-transparent text-dark">
                          {news?.category?.title}
                        </span>
                      </div>
                    </div>
                    <div className="text-muted d-flex align-items-center mt-3">
                      <span className="m-0">{news?.user?.first_name}</span>
                      <i className="fa fa-circle tx-6 mx-2"></i>
                      <span className="text-muted">
                        {formatDate(news?.publish_date)}
                      </span>{" "}
                      {/* Format and display the date */}
                    </div>
                    <div className="mt-2">
                      <h4 className="card-title m-0 tx-12">{news?.title}</h4>
                    </div>
                    <div className="text-muted mt-2">
                      <span className="m-0 tx-11">{news?.short_description}</span>
                    </div>
                    <div className="mg-t-auto">
                      <div className="horizontal-row"></div>
                      <div className="d-flex align-items-center">
                        <div>
                          <span
                            className={`text-info tx-16  ${news?.commentsCount === 0 ? '' : 'cursor-pointer'}`}
                            onClick={() => news?.commentsCount !== 0 && handlePandingComents(news?.id)}
                          >
                            Comments: {news?.commentsCount}
                          </span>
                        </div>
                        <div className="my-2 ms-auto">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                          >
                            <Link href={`/admin/news/edit-news`}
                              className="fe fe-edit"
                              onClick={() => handleEditData(news)}
                            >
                            </Link>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}
                          >
                            <i
                              className="fe fe-trash-2 ms-2 cursor-pointer"
                              onClick={() => {
                                DeleteAlert(news?.id);
                              }}
                            ></i>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Row className="justify-content-center">
                <Card>
                  <div className="mt-2">
                    <div className="px-5 pb-5">
                      <div className="text-center">
                        <i className="mdi mdi-alert-circle-outline w-100 text-center tx-100"></i>
                      </div>
                      {isFilterActive || searchValue ? (
                        <>
                          <div className="text-center empty-state__help">Don't have any News matching with your filter</div>
                          <div className="text-center  mt-3">Click "Reset" button to get all News or try another filter</div>
                        </>
                      ) : (
                        <>
                          <div className="text-center empty-state__help">You don't have any News</div>
                          <div className="text-center  mt-3">Click "Add news" to create new news</div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </Row>
            </Col>
          )
          }
        </Row>

        {/* News post row end */}

        {/* Modal for active inactive state (Activation) start */}
        <Modal show={authModal} onHide={() => setAuthModal(false)}>
          <Modal.Header>
            <Modal.Title>Activation</Modal.Title>
            <Button
              variant=""
              className="btn btn-close"
              onClick={() => setAuthModal(false)}
            >
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to mark this as{" "}
              {modalValue === "Active" ? "active" : "inactive"}
              <span>?</span>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setAuthModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleEdit}>
              {" "}
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal for active inactive state (Activation) end */}
      </>
      {totalNews > itemsPerPage ? (
        <div className="text-wrap mt-5">
          <div>

            <Pagination className="mb-0 justify-content-end">
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="icon ion-ios-arrow-back"></i>
              </Pagination.Prev>

              {pageNumbers.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="icon ion-ios-arrow-forward"></i>
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      ) : null}

      <ToastContainer />
    </div>
  );
};

News.propTypes = {};

News.defaultProps = {};

News.layout = "Contentlayout";

export default News;
