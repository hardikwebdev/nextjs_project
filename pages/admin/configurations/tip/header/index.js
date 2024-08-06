import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Modal, OverlayTrigger, Tooltip, Pagination, Dropdown } from "react-bootstrap";
import Link from "next/link";
import { getSliders, updateSlider } from "@/shared/services/Admin_Apis/slider/sliderCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";


export default function Header() {
  const [modalValue, setModalValue] = useState(""); // set modal value for activation modal
  const [authModal, setAuthModal] = useState(false); // Modal show hide state
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const dispatch = useDispatch();
  let navigate = useRouter();

  const accessToken = useSelector((state) => state?.userData?.access_token);

  const getSliderData = () => {
    const page = 1;
    const pageSize = 1; // Adjust based on your items per page
    const sortBy = "createdAt";
    const sortOrder = "DESC";
    getSliders(accessToken, "tipheader", page, pageSize, sortBy, sortOrder)
      .then(({ data }) => {
        setData(data?.sliderData);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.data?.description) {
          toast.error(error?.response?.data?.description, {
            theme: "dark",
          });
          setLoading(false);
        } else {
          toast.error(error?.response?.data?.message[0], {
            theme: "dark",
          });
          setLoading(false);
        }
        if (error?.response?.data?.statusCode === 401) {
          dispatch(setUserData(null));
          let path = `/admin/login`;
          navigate.push(path);
          setLoading(false);
        }

      })
  }

  const handleModal = (data, slider) => {
    setModalValue(data);
    setAuthModal(true);
  };


  useEffect(() => {
    getSliderData()
  }, [])


  const handleStatus = () => {
    updateSlider(
      accessToken,
      data[0]?.id,
      data[0]?.header_text,
      data[0]?.sub_text,
      data[0]?.media,
      data[0]?.text_button_alignment,
      data[0]?.slider_type,
      data[0]?.status === 1 ? 0 : 1
    )
      .then(({ data }) => {
        toast.success('Tip Header updated successfully', {
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
        getSliderData();
      });
  }

  return (
    <>
      <div
        className="panel-body tabs-menu-body main-content-body-right"
        id="tab4"
      >

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
            {/* Table start */}
            <Row className=" row-sm">
              <Col lg={12} className="mt-5">
                <Card className="custom-card m-0">
                  <div className="table-responsive">
                    <table className="table  table-bordered user-table m-0">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th className="min-wdth-200">Header text</th>
                          <th className="wd-150">Banner image</th>
                          <th className="mail-status">Status</th>
                          <th className="action-btns text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data &&
                          <tr key={data[0]?.id}>
                            <th className="text-center">1</th>
                            <td>
                              <div className="d-flex align-items-center">
                                <span>{data[0]?.header_text}</span>
                              </div>
                            </td>
                            <td className="config-banner-img">
                              <img src={data[0]?.media} alt="" />
                            </td>
                            <td className={`text-${data[0]?.status === 1 ? "success" : "danger"}`}>
                              <div className="Active-badge-user">
                                <span
                                  className={`user-${data[0]?.status === 1 ? "active" : "Inactive"} cursor-pointer tx-13`}
                                  onClick={() => {
                                    handleModal(
                                      data[0]?.status === 1 ? "Inactive" : "Active",
                                      data
                                    );
                                  }}
                                >
                                  <i className={`fe fe-${data[0]?.status === 1 ? "check-circle" : "alert-octagon"} tx-12 me-2`}></i>
                                  <span className="tx-12">{data[0]?.status === 1 ? "Active" : "Inactive"}</span>
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
                                    href={`/admin/configurations/tip/header/EditHeader`}
                                    className="fe fe-edit"
                                  ></Link>
                                </OverlayTrigger>

                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>

                    </table>
                  </div>
                </Card>
              </Col>
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
                <Button variant="primary" type="submit" onClick={handleStatus}>Submit</Button>
              </Modal.Footer>
            </Modal>
            {/* Modal for active inactive state (Activation) end */}


            <ToastContainer />
          </>
        }
      </div >
    </>
  );
}
