import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Dropdown,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Spinner
} from "react-bootstrap";
import Link from "next/link";
import Swal from "sweetalert2";
import Seo from "@/shared/layout-components/seo/seo";
import { createUser, updateUser, deleteUser, resendInvitation, resetUserPassword } from "@/shared/services/Admin_Apis/user/userCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { getUsers } from "@/shared/services/Admin_Apis/user/userCrud";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";
import { useRouter } from "next/router";
import { setSubscriptionCancelPlan } from "@/shared/services/Admin_Apis/subscriptions/subscriptionsCrud";

const User = () => {
  const [modalValue, setModalValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [users, setUsers] = useState([])
  const [totalCategories, setTotalCategories] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatusFilter] = useState(null); // Default to status null
  const [searchValue, setSearchValue] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [search, setSearch] = useState("")
  const [sendStatus, setSendStatus] = useState(null); // Default to status null
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [edit, setEdit] = useState('')
  const [base64ImageArr, setBase64ImageArr] = useState("");
  const [filesImage, setFilesImage] = useState([]); // to upload image
  const [loading, setLoading] = useState(false);
  const [imgUploadError, setImgUploadError] = useState("")

  const dropdownRef = useRef(null);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const accessToken = useSelector((state) => state?.userData?.access_token);


  useEffect(() => {
    if (filesImage?.length === 0) {
      setImgUploadError("")
    }
  }, [filesImage])

  const closeErrorMsg = () => {
    if (imgUploadError) {
      setImgUploadError("");
      setFilesImage([])
    }
  }

  /*
We need to register the required plugins to do image manipulation and previewing.
*/
  const dispatch = useDispatch(); // Get the dispatch function
  let navigate = useRouter();

  registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
  const getData = () => {
    const page = currentPage;
    const pageSize = itemsPerPage; // Adjust based on your items per page

    const sortBy = 'createdAt';
    const sortOrder = 'DESC';
    getUsers(accessToken, page, pageSize, sortBy, sortOrder, status, search)
      .then(({ data }) => {
        setUsers(data.usersData)
        setTotalCategories(data.total)
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





  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      fileItems.forEach((fileItem) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBase64ImageArr(e.target.result);
          formik.setFieldValue("image", e.target.result); // Update the Formik form values
        };
        reader.readAsDataURL(fileItem.file);
      });
    } else {
      setBase64ImageArr();
      formik.setFieldValue("image", ""); // Update the Formik form values
    }
    setFilesImage(fileItems);
  };



  useEffect(() => {
    getData();
  }, [])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {

    getData();
  }, [currentPage])

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

  useEffect(() => {
    getData();
  }, [status, search]);

  const handleStatus = () => {
    updateUser(accessToken, edit.email, edit.first_name, edit.last_name, edit.bio, edit.profile_url, sendStatus === 1 ? 0 : 1)
      .then(({ data }) => {
        toast.success(data?.message, {
          theme: "dark",
        });
        setAuthModal(false)

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
        setAuthModal(false)
      })
      .finally(() => {
        getData();
      });
  }
  const handleModal = (data, user) => {
    setSendStatus(user?.status)
    setEdit(user);
    setModalValue(data);
    if (data === "add" || data === "edit") {
      setShowModal(true);
    } else {
      setAuthModal(true);
    }
  };

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
        text: "Are you sure you want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteUser(id, accessToken)
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
              getData();
            });
        }
      });
  }

  function reInvite(id) {
    resendInvitation(id, accessToken)
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
        getData();
      });
  }

  function resetPass(email) {
    resetUserPassword(email, accessToken)
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
        getData();
      });
  }


  const Schema = Yup.object().shape({
    FirstName: Yup.string()
      .trim()
      .required('First name is required')
      .test('no-empty-spaces', 'First name must contain non-space characters', (value) => {
        return /\S/.test(value);
      }),
    LastName: Yup.string()
      .trim()
      .required('Last name is required')
      .test('no-empty-spaces', 'Last name must contain non-space characters', (value) => {
        return /\S/.test(value);
      }),

    Email: Yup.string()
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
  });


  const initialValues = {
    FirstName: edit && edit.first_name ? edit.first_name : '',
    LastName: edit && edit.last_name ? edit.last_name : '',
    Email: edit && edit.email ? edit.email : '',
    Bio: edit && edit.bio ? edit.bio : '',
  };

  useEffect(() => {
    const updatedInitialValues = {
      FirstName: edit && edit.first_name ? edit.first_name : '',
      LastName: edit && edit.last_name ? edit.last_name : '',
      Email: edit && edit.email ? edit.email : '',
      Bio: edit && edit.bio ? edit.bio : '',
    };
    formik.setValues(updatedInitialValues);
    setFilesImage(edit?.profile_url);
    setBase64ImageArr(edit?.profile_url)
  }, [edit]);



  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      document.getElementById("submitButton").disabled = true;

      if (modalValue === "add") {
        createUser(accessToken, values.Email, values.FirstName, values.LastName, values.Bio, base64ImageArr)
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
            setSubmitting(false);
            setShowModal(false)
            formik.resetForm();
            setLoading(false);
            getData();
          });
      }

      else if (modalValue === "edit") {
        updateUser(accessToken, values.Email, values.FirstName, values.LastName, values.Bio, base64ImageArr ? base64ImageArr : edit?.profile_url, edit?.status)
          .then(({ data }) => {
            toast.success(data?.message, {
              theme: "dark",
            })
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
            setSubmitting(false);
            setShowModal(false)
            setEdit('');
            formik.resetForm();
            getData();
            setLoading(false)
          });
      }


    },
  });


  const handleDowngrade = (user_id) => {
    setSubscriptionCancelPlan(
      accessToken,
      user_id,
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
        getData();
      });
  }


  return (
    <>
      <div className="pb-5">
        <Seo title={"Users"} />

        <Card className="mt-4">
          <Card.Body className="py-0">
            <div className="breadcrumb-header justify-content-between">
              <div className="left-content">
                <span className="main-content-title mg-b-0 mg-b-lg-1">
                  Users
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>


        <Row className="row-sm ">
          <Col lg={12}>
            <Card className=" mg-b-20 shadow-search">
              <Card.Body className="p-3">
                <Row className="align-items-center">
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

                  <Col sm={12} md={6} className="mt-sm-2 mt-0">
                    <div className="d-flex justify-content-sm-end align-items-center justify-content-between">
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
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 3 ? 'all' : ''}`}
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
                                <button
                                  className={`dropdown-item d-flex border-bottom dropdown-item ${status === 2 ? 'active' : ''}`}
                                  onClick={() => handleStatusFilterChange(2)}
                                >
                                  <div className="wd-90p">
                                    <div className="d-flex">
                                      <h5 className="mb-0 name">Invited</h5>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="ms-4">
                        <Button
                          className="btn btn-primary d-flex align-items-center"
                          onClick={() => {
                            handleModal("add");
                          }}
                        >
                          <i className="si si-plus me-2 tx-15"></i>
                          <span className="tx-15">Add user</span>
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className=" row-sm">
          {users?.length > 0 ? (
            <Col lg={12}>
              <Card className="custom-card shadow-search">
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table  table-bordered user-table m-0">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th className="min-wdth-200">Name</th>
                          <th className="mail-status">Email</th>
                          <th className="min-wdth-200">Active subscription plan</th>
                          <th className="mail-status">Status</th>
                          <th className="min-width-150 text-center">User actions</th>
                          <th className="min-width-150 text-center">Subscription actions</th>
                        </tr>
                      </thead>

                      {/* Inside your component's JSX */}
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id} className="text-muted">
                            <th className="text-center">{index + 1}</th>
                            <td>
                              <div className="d-flex align-items-center">
                                <span>{user.first_name} {user.last_name}</span>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                            {user?.subscriptionData === null ? "Basic" : user?.subscriptionData?.subscription_plan?.package_name}
                            </td>
                            <td className={`text-${user.status === 1 ? 'success' : null || user.status === 0 ? 'danger' : null || user.status === 2 ? 'info' : null || user.status === 3 ? 'info' : null}`}>
                              <div className="Active-badge-user">
                                <span
                                  className={`justify-content-center text-nowrap user-${user.status === 1 ? 'active cursor-pointer' : null || user.status === 0 ? 'Inactive cursor-pointer' : null || user.status === 2 ? 'Invited' : null || user.status === 3 ? 'Invited' : null} `}
                                  onClick={() => {
                                    if (user.status === 0 || user.status === 1) {
                                      handleModal(user.status === 0 ? 'Inactive' : 'Active', user);
                                    }
                                  }}
                                >
                                  {user.status === 0 && user.status === 1 ? (
                                    <i className={`fe fe-${user.status === 1 ? 'check-circle' : 'alert-octagon'} tx-12 me-2`}></i>

                                  ) :
                                    <i className="si si-envelope-letter tx-12 me-2"></i>
                                  }
                                  <span className="tx-13">
                                    {user.status === 0 ? 'Inactive' : null || user.status === 1 ? 'Active' : null || user.status === 2 ? 'Invited' : null || user.status === 3 ? 'Verification pending' : null}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="text-center">
                              {user.status === 2 || user.status === 3 ? (
                                <i className="fa fa-minus"
                                ></i>
                              ) :
                                (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                                  >
                                    <i
                                      onClick={() => {
                                        handleModal('edit', user); // Pass the user data to the edit modal
                                      }}
                                      className="fe fe-edit cursor-pointer"
                                    ></i>
                                  </OverlayTrigger>
                                )
                              }

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-delete`}>Delete</Tooltip>}
                              >
                                <i
                                  onClick={(e) => {
                                    DeleteAlert(user?.id);
                                  }}
                                  className="fe fe-trash-2 cursor-pointer ms-3"
                                ></i>
                              </OverlayTrigger>
                              {user.status === 2 ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip id={`tooltip-delete`}>Resend Invitation</Tooltip>}
                                >
                                  <i className="far fa-envelope tx-16 ms-3 cursor-pointer" onClick={() =>
                                    reInvite(user?.id)
                                  }></i>
                                </OverlayTrigger>
                              ) : null}
                              {user.status === 0 || user.status === 1 ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip id={`tooltip-delete`}>Reset Password</Tooltip>}
                                >
                                  <i className="fe fe-unlock tx-16 ms-3 cursor-pointer" onClick={() =>
                                    resetPass(user?.email)
                                  }></i>
                                </OverlayTrigger>
                              ) : null}




                            </td>
                            <td className="text-center">
                              {user.status === 2 || user.status === 3 ?
                                <i className="fa fa-minus"
                                ></i>
                                :
                                <>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-top`}>Edit Subscription</Tooltip>}
                                  >
                                    <Link
                                      href={`/admin/users/subscription?id=${encodeURIComponent(JSON.stringify(user?.id))}`}
                                      className="fe fe-edit cursor-pointer"
                                    ></Link>
                                  </OverlayTrigger>
                                  {user?.subscriptionData?.plan_id === 2 ?
                                    <>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-top`}>Cancel plan</Tooltip>}
                                      >
                                        <i
                                          className="fa fa-times-circle ms-3 tx-16 cursor-pointer"
                                          onClick={() => handleDowngrade(user?.id)}
                                        ></i>
                                      </OverlayTrigger>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-delete`}>View billing history</Tooltip>}
                                      >
                                        <Link
                                          href={`/admin/users/planHistory?id=${encodeURIComponent(JSON.stringify(user?.id))}`}
                                          className="fa fa-history tx-16 ms-3"
                                        ></Link>
                                        {/* <i className=" cursor-pointer"></i> */}
                                      </OverlayTrigger>
                                    </>
                                    : null
                                  }
                                </>
                              }
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
                      {isFilterActive || searchValue ? (
                        <>
                          <div className="text-center empty-state__help">Don't have any User matching with your filter</div>
                          <div className="text-center  mt-3">Click "Reset" button to get all Users or try another filter</div>
                        </>
                      ) : (
                        <>
                          <div className="text-center empty-state__help">You don't have any Users</div>
                          <div className="text-center  mt-3">Click "Add user" to add new user</div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </Row>
            </Col>
          )}
        </Row>

        {/* Add/Edit/Activation Modal */}
        {modalValue === "add" || modalValue === "edit" ? (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header>
              <Modal.Title>
                {modalValue === "add" ? "Add User" : "Edit User"}
              </Modal.Title>
              <Button
                variant=""
                className="btn btn-close"
                onClick={() => {
                  if (modalValue === "add") {
                    formik.resetForm();
                    setShowModal(false);
                  } else {
                    setShowModal(false);
                  }
                }}
              >
                x
              </Button>
            </Modal.Header>
            <Modal.Body>

              <Form onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission
                formik.handleSubmit(); // Trigger form submission
              }}>
                <Row>
                  <Col md={12} className="userFilepond">
                    {filesImage?.length > 0 && imgUploadError ?
                      <div className="">
                        <p className="filepond--error m-0 position-relative mb-3">
                          {imgUploadError.main}
                          <span className="position-absolute" onClick={closeErrorMsg}><i className="fa fa-times-circle" aria-hidden="true"></i></span>
                        </p>

                        <FilePond
                          labelIdle={edit?.profile_url ? `<img src=${edit?.profile_url} class="h-100 w-100"/>` : `<img src="../../../assets/img/avatar.png" class="h-100 w-100"/>`}
                          imagePreviewHeight={170}
                          imageCropAspectRatio="1:1"
                          imageResizeTargetWidth={200}
                          imageResizeTargetHeight={200}
                          stylePanelLayout="compact circle"
                          styleLoadIndicatorPosition="center bottom"
                          styleButtonRemoveItemPosition="center bottom"
                          allowReorder={true}
                          allowMultiple={false} // Allow multiple file uploads
                          allowFileTypeValidation={true}
                          acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                          onupdatefiles={handleFilePondUpdate}
                          maxFileSize={10 * 1024 * 1024}
                          labelMaxFileSizeExceeded={'File is too large'}
                          onerror={(error) => {
                            setImgUploadError(error)
                          }}

                        />
                        {imgUploadError ? "" :
                          <>
                            {modalValue === "add" ? (<div className="text-center tx-14 font-weight-bold text-danger mt-1">
                              Click on avatar to upload user image
                            </div>) : (<div className="text-center tx-14 font-weight-bold text-danger mt-1">
                              Click on user image to change image
                            </div>)}
                          </>
                        }
                      </div>


                      :
                      <>
                        <FilePond
                          labelIdle={edit?.profile_url ? `<img src=${edit?.profile_url} class="h-100 w-100"/>` : `<img src="../../../assets/img/avatar.png" class="h-100 w-100"/>`}
                          imagePreviewHeight={170}
                          imageCropAspectRatio="1:1"
                          imageResizeTargetWidth={200}
                          imageResizeTargetHeight={200}
                          stylePanelLayout="compact circle"
                          styleLoadIndicatorPosition="center bottom"
                          styleButtonRemoveItemPosition="center bottom"
                          allowReorder={true}
                          allowMultiple={false} // Allow multiple file uploads
                          allowFileTypeValidation={true}
                          acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                          onupdatefiles={handleFilePondUpdate}
                          maxFileSize={10 * 1024 * 1024}
                          labelMaxFileSizeExceeded={'File is too large'}
                          onerror={(error) => {
                            setImgUploadError(error)
                          }}

                        />
                        {modalValue === "add" ? (<div className="text-center tx-14 font-weight-bold text-danger mt-1">
                          Click on avatar to upload user image
                        </div>) : (<div className="text-center tx-14 font-weight-bold text-danger mt-1">
                          Click on user image to change image
                        </div>)}
                      </>
                    }

                  </Col>
                  <Col md={12} className="mt-2">
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Enter First Name"
                        type="text"
                        name="FirstName"
                        value={formik.values.FirstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.FirstName && formik.touched.FirstName && (
                        <div className="text-danger">{formik.errors.FirstName}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Enter Last Name"
                        type="text"
                        name="LastName"
                        value={formik.values.LastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.LastName && formik.touched.LastName && (
                        <div className="text-danger">{formik.errors.LastName}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      {edit ? (
                        <Form.Control
                          className="form-control"
                          placeholder="Email"
                          type="text"
                          name="Email"
                          value={formik.values.Email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled
                        />
                      ) : (
                        <Form.Control
                          className="form-control"
                          placeholder="Email"
                          type="text"
                          name="Email"
                          value={formik.values.Email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      )}

                      {formik.errors.Email && formik.touched.Email && (
                        <div className="text-danger">{formik.errors.Email}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Bio</Form.Label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter Bio"
                        name="Bio"
                        value={formik.values.Bio}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                    </Form.Group>
                  </Col>

                  <div className="horizontal-row my-3 w-100"></div>
                  <Col md={12}>
                    <div className="text-end">
                      <Button variant="danger" onClick={() => {
                        if (modalValue === "add") {
                          formik.resetForm();
                          setShowModal(false);
                        } else {
                          setShowModal(false);
                        }
                      }}>
                        Close
                      </Button>

                      <Button variant="primary" type="submit" id="submitButton" className={`ms-3 ${imgUploadError ? 'disabled' : null}`} >

                        {loading ?
                          <Spinner animation="border"
                            className="spinner-border spinner-border-sm "
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                          : "Publish now"}
                      </Button>
                      {/* <Button variant="primary" className="ms-3" id="submitButton" type="submit">Submit</Button> */}
                    </div>
                  </Col>


                </Row>
              </Form>
            </Modal.Body>

          </Modal>
        ) : (
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
                {sendStatus === 0 ? "active" : "inactive"}
                <span>?</span>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setAuthModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleStatus}>Submit</Button>
            </Modal.Footer>
          </Modal>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

User.propTypes = {};

User.defaultProps = {};

User.layout = "Contentlayout";

export default User;
