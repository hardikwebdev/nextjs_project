import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  FormGroup,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import Seo from "@/shared/layout-components/seo/seo";
import { useSelector } from "react-redux";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getUserPlanHistory } from "@/shared/services/Admin_Apis/subscriptions/subscriptionsCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { subDays } from 'date-fns'; // Import the subDays function
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";


const PlanHistory = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [status, setStatusFilter] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionDataOnDate, setSubscriptionDataOnDate] = useState(false)
  const [total, setTotal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(subDays(new Date(), new Date().getDate() - 1));
  const [endDate, setEndDate] = useState(new Date());
  const dispatch = useDispatch();
  let navigate = useRouter();
  function formatDateForAPi(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  const { id } = navigate.query;
  const user_id = id ? parseInt(id) : null;

  console.log(user_id);

  const formattedStartDate = formatDateForAPi(startDate);
  const formattedEndDate = formatDateForAPi(endDate);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const accessToken = useSelector((state) => state?.userData?.access_token);



  const getSubscriptionPlans = () => {
    const page = currentPage;
    const pageSize = itemsPerPage;
    const sortBy = "createdAt";
    const sortOrder = "DESC";

    getUserPlanHistory(accessToken, page, pageSize, sortBy, sortOrder, formattedStartDate, formattedEndDate, status, user_id)
      .then(({ data }) => {
        setSubscriptions(data.billingHistoryData);
        setTotal(data.total);
        if (data.total === 0) {
          setSubscriptionDataOnDate(true)
        }
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
    getSubscriptionPlans();
  }, []);


  const handleDateChange = () => {
    getSubscriptionPlans();
  }



  const resetSearchAndFilter = () => {
    setStatusFilter(null);
    setIsFilterActive(false);
    setEndDate(new Date());
    setStartDate(subDays(new Date(), new Date().getDate() - 1))
    setSubscriptionDataOnDate(false)
  };


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


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getSubscriptionPlans()
  }, [currentPage, status, subscriptionDataOnDate])

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



  return (
    <>
      <div className="pb-5">
        <Seo title={"Subscription"} />

        <Card className="mt-4">
          <Card.Body className="py-0">
            <div className="breadcrumb-header justify-content-between">
              <div className="left-content">
                <span className="main-content-title mg-b-0 mg-b-lg-1">
                  Subscriptions
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>


        <Row className="row-sm">
          <Col lg={12}>
            <Card className=" mg-b-20">
              <Card.Body className="pt-2 pb-3 px-3 shadow-search">
                <Row className="align-items-end">

                  <Col xl={7} md={10} className="mt-md-2 mt-2 ">
                    <Row className="align-items-end">
                      <Col md={4} className="mt-md-0 mt-2">
                        <div>
                          <FormGroup>
                            <Form.Label className="form-label text-dark m-0">
                              Start date
                            </Form.Label>
                            <InputGroup className="input-group reactdate-pic">
                              <DatePicker
                                className="form-control"
                                selected={startDate}
                                onChange={(date) => setStartDate(new Date(date))}
                                maxDate={new Date()}
                              />
                            </InputGroup>
                          </FormGroup>

                        </div>
                      </Col>
                      <Col md={4} className="mt-md-0 mt-2">
                        <div>
                          <FormGroup>
                            <Form.Label className="form-label text-dark m-0">
                              End date
                            </Form.Label>
                            <InputGroup className="input-group reactdate-pic">
                              <DatePicker
                                className="form-control"
                                selected={endDate}
                                onChange={(date) => setEndDate(new Date(date))}
                                minDate={startDate}
                                maxDate={new Date()}
                              />
                            </InputGroup>
                          </FormGroup>

                        </div>

                      </Col>
                      <Col md={2} className="mt-md-0 mt-2">
                        <div>
                          <Button onClick={handleDateChange}>Submit</Button>
                        </div>
                      </Col>
                      <Col md={2} className="mt-sm-2 mt-0">
                        <div>
                          {isFilterActive || subscriptionDataOnDate ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`tooltip-top`}>Reset</Tooltip>}
                            >
                              <Button
                                variant="danger"
                                className="btn tx-14 px-4"
                                onClick={resetSearchAndFilter}
                              >
                                Reset

                              </Button>
                            </OverlayTrigger>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={5} md={2} className="mb-2 mt-2">
                    <div className="d-flex justify-content-end align-items-center ">

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
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 0 ? 'all' : ''}`}
                                  onClick={() => handleStatusFilterChange(null)}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">All</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 'auto_renew' ? 'auto_renew' : ''}`}
                                  onClick={() => handleStatusFilterChange('auto_renew')}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Auto</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 'subscription' ? 'subscription' : ''}`}
                                  onClick={() => handleStatusFilterChange('subscription')}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Subscription</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 'expired' ? 'expired' : ''}`}
                                  onClick={() => handleStatusFilterChange('expired')}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Expired</h5>
                                    </div>
                                  </div>
                                </button>
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 'cancelled' ? 'cancelled' : ''}`}
                                  onClick={() => handleStatusFilterChange('cancelled')}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Cancel</h5>
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
                    </div>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          {subscriptions?.length > 0 ? (
            <Col lg={12}>
              <Card className="custom-card">
                <Card.Body className="shadow-search">
                  <div className="table-responsive">
                    <table className="table  table-bordered user-table">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th className="">Package</th>
                          <th className="mail-status ">Start date - End date</th>
                          <th className="mail-status text-center">Renewal date</th>
                          <th className="mail-status">Type</th>
                          <th className="mail-status">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((subscription, index) => (
                          <tr key={subscription?.id} className="text-muted">
                            <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{subscription?.subscribed_user?.subscription_plan?.package_name}</td>
                            <td>
                              <span>{formatDate(subscription?.start_date)}</span><span className="ms-2">To</span><span className="ms-2">{formatDate(subscription?.end_date)}</span>
                            </td>
                            {subscription?.transaction_type === 'subscription' || subscription?.transaction_type === 'auto_renew' ? (
                              <td className="text-center">{formatDate(subscription?.next_renewal_date)}</td>
                            ) : (
                              <td className="text-center"><i className="fe fe-minus"></i></td>
                            )}
                            <td className="text-capitalize">{subscription?.subscribed_user?.subscritpion_type}</td>
                            <td className={subscription?.transaction_type === 'subscription' ? 'text-success' : subscription?.transaction_type === 'auto_renew' ? 'text-info' : subscription?.transaction_type === 'expired' ? 'text-danger' : 'text-warning'}>
                              <div className="Active-badge-user" >
                                <span className={`justify-content-center user-${subscription?.transaction_type === 'subscription' ? 'active' : subscription?.transaction_type === 'auto_renew' ? 'Invited' : subscription?.transaction_type === 'expired' ? 'Inactive' : 'Cancel'}`}>
                                  <i className={`fe fe-${subscription?.transaction_type === 'subscription' ? 'check-circle' : subscription?.transaction_type === 'auto_renew' ? 'repeat' : subscription?.transaction_type === 'expired' ? 'alert-octagon' : 'x-circle'} tx-12 me-2`}></i>
                                  <span className="tx-14">{subscription?.transaction_type === 'subscription' ? 'Subscription' : subscription?.transaction_type === 'auto_renew' ? 'Auto' : subscription?.transaction_type === 'expired' ? 'Expired' : 'Cancel'}</span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </Card.Body>
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
                          <div className="text-center empty-state__help">Don't have any Subscription matching with your filter</div>
                          <div className="text-center  mt-3">Click "Reset" button to get all Subscription or try another filter</div>
                        </>
                      ) : (
                        <>
                          {subscriptionDataOnDate ? (
                            <>
                              <div className="text-center empty-state__help">Don't have any Subscription matching with your date</div>
                              <div className="text-center  mt-3">Click "Reset" button to get all Subscription or try another date</div>
                            </>
                          ) : (
                            <div className="text-center empty-state__help">You don't have any Subscription</div>

                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </Row>
            </Col>
          )}
        </Row>
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
    </>
  );
};

PlanHistory.propTypes = {};

PlanHistory.defaultProps = {};

PlanHistory.layout = "Contentlayout";

export default PlanHistory;
