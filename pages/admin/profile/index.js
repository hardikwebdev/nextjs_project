import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import EditProfile from "./editProfile";
import { getProfileData } from "@/shared/services/Admin_Apis/profile/profileCrud";
import { useSelector } from "react-redux";
import { Card, Col, Row, Nav } from "react-bootstrap";
import Seo from "@/shared/layout-components/seo/seo";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";

const Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const [activeTab, setActiveTab] = useState("EditProfile"); 
  const accessToken = useSelector((state) => state?.userData?.access_token);
  const userData = useSelector((state) => state?.userData?.data?.userProfileData ? state?.userData?.data?.userProfileData : state?.userData?.userData);

  const dispatch = useDispatch();
  let navigate = useRouter();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;



  const getData = () => {
    getProfileData(accessToken)
      .then(({ data }) => {
        setProfileData([data.userProfileData]);
      })
      .catch((error) => {
        console.log(error);
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
      });
  };

  useEffect(() => {
    getData();
  }, []);
   

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const navLinkStyle = {
    borderBottom: "2px solid #102B57", 
  };

  return (
    <>
      <Seo title={"Profile"} />
      <div className="pb-5">
        <Card className="mt-4">
          <Card.Body className="py-0">
            <div className="breadcrumb-header justify-content-between">
              <div className="left-content">
                <span className="main-content-title mg-b-0 mg-b-lg-1">Profile</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row>
            <Col lg={12} md={12} >
              <Card className="custom-card customs-cards">
                <Card.Body className="d-md-flex bg-white shadow-search">
                  <div className="">
                    <span className="profile-image pos-relative">
                      {userData?.profile_url ? (
                        <img className="br-5" alt="" src={userData?.profile_url} />
                      ) : (
                        <img
                          className="br-5"
                          alt=""
                          src={"../../../assets/img/squareAvatar.svg"}
                        />
                      )}
                      <span className="bg-success text-white wd-1 ht-1 rounded-pill profile-online"></span>
                    </span>
                  </div>
                  <div className="my-md-auto mt-4 prof-details">
                    <h4 className="font-weight-semibold ms-md-4 ms-0 mb-1 pb-0">
                      {userData?.first_name} {userData?.last_name}
                    </h4>
                    <p className="tx-13 text-muted ms-md-4 ms-0 mb-2 pb-2 ">
                      <span className="me-3">
                        <i className="far fa-address-card me-2"></i>
                        {userData?.role === 0 ? "Admin" : "Testers"}
                      </span>
                    </p>
                    <p className="text-muted ms-md-4 ms-0 mb-2">
                      <span>
                        <i className="fa fa-envelope me-2"></i>
                      </span>
                      <span className="font-weight-semibold me-2">Email:</span>
                      <span>{userData?.email}</span>
                    </p>
                    <p className="text-muted ms-md-4 ms-0 mb-2">
                      <span>
                        <i className="fa fa-globe me-2"></i>
                      </span>
                      <span className="font-weight-semibold me-2">Website:</span>
                      <span>{baseUrl}</span>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          <Col lg={12} md={12} className="mt-3">
            <Card className="custom-card customs-cards">
              <Card.Body className="bg-white shadow-search p-0  ">
                <div className="py-0">
                  <div className="profile-tab tab-menu-heading border-bottom-0">
                    <Row className="row-sm">
                      <Col lg={12} md={12}>
                        <div className="custom-card main-content-body-profile">
                          <Nav variant="tabs" className="p-0 m-0">

                            <Nav.Item>
                              <Nav.Link
                                eventKey="EditProfile"
                                onClick={() => switchTab("EditProfile")}
                                style={activeTab === "EditProfile" ? navLinkStyle : {}}
                              >
                                Profile update
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                eventKey="ChangePassword"
                                onClick={() => switchTab("ChangePassword")}
                                style={activeTab === "ChangePassword" ? navLinkStyle : {}}
                              >
                                Change password
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} md={12} className="mt-3">
            <Card className="custom-card customs-cards">
              <Card.Body className="bg-white shadow-search">
                {activeTab === "ChangePassword" && <ChangePassword />}
                {activeTab === "EditProfile" && <EditProfile />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

Profile.propTypes = {};

Profile.defaultProps = {};

Profile.layout = "Contentlayout";

export default Profile;

