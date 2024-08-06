import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Row, Button, Modal, OverlayTrigger, Tooltip, Pagination, Dropdown } from "react-bootstrap";
import Link from "next/link";
import Swal from "sweetalert2";
import { getSliders, updateSlider, deleteSlider } from "@/shared/services/Admin_Apis/slider/sliderCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";


export default function Home() {
  const [modalValue, setModalValue] = useState(""); // set modal value for activation modal
  const [authModal, setAuthModal] = useState(false); // Modal show hide state
  const [sliders, setSliders] = useState([])
  const [sendStatus, setSendStatus] = useState(null); // Default to status null
  const [edit, setEdit] = useState("");
  const [total, setTotal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatusFilter] = useState(null); // Default to status null
  const [isFilterActive, setIsFilterActive] = useState(false);


  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  let navigate = useRouter();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const accessToken = useSelector((state) => state?.userData?.access_token);



  const getSliderData = () => {
    const page = currentPage;
    const pageSize = itemsPerPage; // Adjust based on your items per page
    const sortBy = "createdAt";
    const sortOrder = "DESC";
    getSliders(accessToken, "home", page, pageSize, sortBy, sortOrder, status)
      .then(({ data }) => {
        setSliders(data.sliderData);
        setTotal(data.total)
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


  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    if (status === null) {
      setIsFilterActive(false);
    }
    else {
      setIsFilterActive(true);
    }
  })

  useEffect(() => {
    getSliderData()
  }, [status])


  useEffect(() => {
    getSliderData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {

    getSliderData();
  }, [currentPage])

  const resetSearchAndFilter = () => {
    setStatusFilter(null); // Clear the status filter
    setIsFilterActive(false);
  };


  const handleModal = (data, slider) => {
    console.log(slider);
    setSendStatus(slider?.status);
    setEdit(slider);
    setModalValue(data);
    setAuthModal(true);
  };


  const handleEdit = () => {
    updateSlider(
      accessToken,
      edit.id,
      edit.header_text,
      edit.sub_text,
      edit.media,
      edit.text_button_alignment,
      edit.slider_type,
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
        getSliderData();
      });
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
        text: "Are you sure you want to delete this slider?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSlider(id, accessToken)
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
              getSliderData();
            });
        }
      });
  }

  return (
    <div
      className="panel-body tabs-menu-body main-content-body-right"
      id="tab4"
    >

      {/* Add home banner button start */}
      <div className=" mg-b-20">
        <div className="text-end">
          <div className="d-flex flex-wrap justify-content-sm-end align-items-center justify-content-between">
            {/* Filter start */}

            {isFilterActive ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Reset</Tooltip>}
              >
                <Button
                  variant="danger"
                  className="btn tx-16 px-4 reset_slide_btn mt-2 me-4"
                  onClick={resetSearchAndFilter}
                >
                  Reset

                </Button>
              </OverlayTrigger>
            ) : null}

            <div ref={dropdownRef} className="mt-2 me-3">

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
            </div>
            {/* Filter end */}

            {/* Filter end */}

            {/* Add category start */}
            <div className="ms-0 mt-2">
              <Link
                href="/admin/configurations/slider/home/Add-banner"
              >
                <Button className="d-flex align-items-center">
                  <i className="si si-plus me-2 tx-15"></i>
                  <span className="tx-15">Add home banner</span>
                </Button>
              </Link>
            </div>
            {/* Add category end */}
          </div>




        </div>
      </div>
      {/* Add home banner button end */}

      {/* Table start */}
      <Row className=" row-sm">
        {sliders?.length > 0 ? (
          <Col lg={12}>
            <Card className="custom-card">
              <div className="table-responsive">
                <table className="table  table-bordered user-table">
                  <thead>
                    <tr>
                      <th>Sr</th>
                      <th className="min-wdth-200">Header text</th>
                      <th className="wd-150">Banner image</th>
                      <th className="mail-status">Status</th>
                      <th className="action-btns">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sliders.map((slider, index) => (
                      <tr key={slider.id}>
                        <th className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                        <td>
                          <div className="d-flex align-items-center">
                            <span>{slider.header_text}</span>
                          </div>
                        </td>
                        <td className="config-banner-img">
                          <img src={slider.media} alt="" />
                        </td>
                        <td className={`text-${slider.status === 1 ? "success" : "danger"}`}>
                          <div className="Active-badge-user">
                            <span
                              className={`user-${slider.status === 1 ? "active" : "Inactive"} cursor-pointer tx-13`}
                              onClick={() => {
                                handleModal(
                                  slider.status === 1 ? "Inactive" : "Active",
                                  slider
                                );
                              }}
                            >
                              <i className={`fe fe-${slider.status === 1 ? "check-circle" : "alert-octagon"} tx-12 me-2`}></i>
                              <span className="tx-12">{slider.status === 1 ? "Active" : "Inactive"}</span>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                            >
                              <Link
                                href={`/admin/configurations/slider/home/Add-banner?mode=edit&data=${encodeURIComponent(JSON.stringify(slider))}`}
                                as={`/admin/configurations/slider/home/edit-banner`}
                                className="fe fe-edit"
                              ></Link>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}
                            >
                              <i
                                onClick={() => DeleteAlert(slider.id)}
                                className="fe fe-trash-2 ms-2 cursor-pointer text-dark"
                              ></i>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </Card>
          </Col>
        ) : (
          <Col>
            <Row className="justify-content-center">
              <Card>
                <div className="mt-2">
                  <div className="px-5 pb-5">
                    <div className="text-center">
                      <i className="mdi mdi-alert-circle-outline w-100 text-center tx-100"></i>
                    </div>

                    {isFilterActive ? (
                      <>
                        <div className="text-center empty-state__help">Don't have any Banner matching with your filter</div>
                        <div className="text-center  mt-3">Click "Reset" button to get all banner or try another filter</div>
                      </>
                    ) : (
                      <>
                        <div className="text-center empty-state__help">You don't have any banner</div>
                        <div className="text-center  mt-3">Click "Add home banner" button to create new banner</div>
                      </>
                    )}


                  </div>
                </div>
              </Card>
            </Row>
          </Col>
        )}
      </Row>
      {/* Table end */}

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
          <Button variant="primary" type="submit" onClick={handleEdit}>Submit</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for active inactive state (Activation) end */}

      {total > itemsPerPage ? (
        <>
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
        </>
      ) : null}
      <ToastContainer />
    </div >
  );
}
