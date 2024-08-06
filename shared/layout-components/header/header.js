import React, { useState, useEffect } from "react";
import {
  Navbar,
  Dropdown,
  Button,
  Form,
  Col,
  Row,
  Modal,
} from "react-bootstrap";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { resetUserData } from "@/shared/redux/actions/authAction";
import { getProfileData } from "@/shared/services/Admin_Apis/profile/profileCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function Header() {
  const [profileData, setProfileData] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const data = useSelector((state) => state?.generalConfigs);
  const userData = useSelector((state) => state?.userData?.data?.userProfileData ? state?.userData?.data?.userProfileData : state?.userData?.userData);
  const accessToken = useSelector((state) => state?.userData?.access_token);
  let { basePath } = useRouter();
  let navigate = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(resetUserData());
    let path = `/admin/login`;
    navigate.push(path);
  };

  const handleProfile = () => {
    setDropdownOpen(false); // Close the dropdown
    let path = `/admin/profile`;
    navigate.push(path);
  }

  const getData = () => {
    getProfileData(accessToken)
      .then(({ data }) => {
        setProfileData(data.userProfileData);
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
      });
  };

  useEffect(() => {
    getData();
  }, []);


  //leftsidemenu
  const openCloseSidebar = () => {
    document.querySelector("body").classList.toggle("sidenav-toggled");
  };


  // responsivesearch
  const responsivesearch = () => {
    document.querySelector(".navbar-form").classList.toggle("active");
  };
  //swichermainright





  return (
    <Navbar className="main-header side-header sticky nav nav-item">
      <div className="main-container container-fluid">
        <div className="main-header-left ">
          <div className="responsive-logo">
            <Link
              href={`/admin/dashboard/`}
              className="header-logo"
            >
              <img
                src={data?.site_logo}
                className="mobile-logo logo-1"
                alt="logo"
              />
              {/* <img
                src={`${process.env.NODE_ENV === "production" ? basePath : ""
                  }/assets/img/brand/logo-white.png`}
                className="mobile-logo dark-logo-1"
                alt="logo"
              /> */}
            </Link>
          </div>
          <div
            className="app-sidebar__toggle"
            data-bs-toggle="sidebar"
            onClick={() => openCloseSidebar()}
          >
            <Link className="open-toggle" href="#!">
              <i className="header-icon fe fe-align-left"></i>
            </Link>
            <Link className="close-toggle" href="#!">
              <i className="header-icon fe fe-x"></i>
            </Link>
          </div>
          <div className="logo-horizontal">
            <Link href={`/admin/dashboard/`} className="header-logo">
              <img
                src={data?.site_logo}
                className="mobile-logo logo-1"
                alt="logo"
              />
              {/* <img
                src={`${process.env.NODE_ENV === "production" ? basePath : ""
                  }/assets/img/brand/logo-white.png`}
                className="mobile-logo dark-logo-1"
                alt="logo"
              /> */}
            </Link>
          </div>
        </div>
        <div className="main-header-right">
          <Navbar.Toggle
            className="navresponsive-toggler d-lg-none ms-auto"
            type="button"
          >
            <span className="navbar-toggler-icon fe fe-more-vertical"></span>
          </Navbar.Toggle>
          <div className="mb-0 navbar navbar-expand-lg navbar-nav-right responsive-navbar navbar-dark p-0 nav-collapse-admin">
            <Navbar.Collapse className="collapse" id="navbarSupportedContent-4">
              <ul className="nav nav-item header-icons navbar-nav-right ">
                <li>
                  <Dropdown className=" main-profile-menu nav nav-item nav-link ps-lg-2"
                    show={isDropdownOpen}
                    onToggle={(isOpen) => setDropdownOpen(isOpen)}
                  >
                    <Dropdown.Toggle
                      className="new nav-link profile-user d-flex"
                      variant=""
                    >
                      {userData?.profile_url ? (
                        <img className="br-5" alt="" src={userData?.profile_url} />
                      ) : (
                        <img
                          className="br-5"
                          alt=""
                          src={"../../../assets/img/squareAvatar.svg"}
                        />
                      )}
                      {/* <img
                        alt=""
                        src={`${process.env.NODE_ENV === "production" ? basePath : ""
                          }/assets/img/faces/2.jpg`}
                        className=""
                      /> */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="flex-column">
                      <div className="menu-header-content p-3 border-bottom">
                        <div className="d-flex wd-100p">
                          <div className="main-img-user">
                            {userData?.profile_url ? (
                              <img className="br-5" alt="" src={userData?.profile_url} />
                            ) : (
                              <img
                                className="br-5"
                                alt=""
                                src={"../../../assets/img/squareAvatar.svg"}
                              />
                            )}
                          </div>
                          <div className="ms-3 my-auto">
                            <h6 className="tx-15 font-weight-semibold mb-0">
                              {userData?.first_name} {userData?.last_name}
                            </h6>
                            <span className="dropdown-title-text subtext op-6  tx-12">
                              {userData?.role === 0 ? "Super Admin" : "Tester"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn dropdown-item"
                        onClick={handleProfile}
                      >
                        <i className="far fa-user-circle"></i>Profile
                      </button>
                      <button className="btn dropdown-item" onClick={handleSignOut}>
                        <i className="far fa-arrow-alt-circle-left"></i> Sign
                        Out
                      </button>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </Navbar.Collapse>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

Header.propTypes = {};

Header.defaultProps = {};
