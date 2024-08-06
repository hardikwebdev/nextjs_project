import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { setSubscriptionsPlan, setSubscriptionCancelPlan, getUserProfile, getSubscriptionsPlans } from "@/shared/services/Admin_Apis/subscriptions/subscriptionsCrud";
import Seo from "@/shared/layout-components/seo/seo";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "filepond/dist/filepond.min.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const OtherPlans = () => {
  const router = useRouter()
  const { id } = router.query;
  const user_id = id ? parseInt(id) : null;
  const accessToken = useSelector((state) => state?.userData?.access_token);
  const [userData, setUserData] = useState("")
  const [subscriptionPlan, setSubscriptionPlan] = useState()


  const getUserData = () => {
    getUserProfile(
      accessToken,
      user_id,
    )
      .then(({ data }) => {
        toast.success(data?.message, {
          theme: "dark",
        });
        setUserData(data?.userProfileData)
      })
      .catch((error) => {
        toast.error(error?.response?.data?.description, {
          theme: "dark",
        });
      })
  }

  const getSubscriptions = () => {
    getSubscriptionsPlans(
      accessToken,
    )
      .then(({ data }) => {
        toast.success(data?.message, {
          theme: "dark",
        });
        setSubscriptionPlan(data?.subscriptionsPlans)
      })
      .catch((error) => {
        toast.error(error?.response?.data?.description, {
          theme: "dark",
        });
      })
  }

  useEffect(() => {
    if (subscriptionPlan && userData?.subscriptionData !== undefined) {
        const sortedSubsPlans = [...subscriptionPlan].sort((a, b) => {
            if (userData?.subscriptionData === null) {
                return a.id - b.id;
            }
            if (userData.subscriptionData.plan_id === 3) {
                if (a.id === userData.subscriptionData.plan_id) return -1;
                if (b.id === userData.subscriptionData.plan_id) return 1;
            } else if (userData.subscriptionData.plan_id === 2) {
                if (a.id === userData.subscriptionData.plan_id) return -1;
                if (b.id === userData.subscriptionData.plan_id) return 1;
            }
            return a.id - b.id;
        });
        if (
            JSON.stringify(sortedSubsPlans) !== JSON.stringify(subscriptionPlan)
        ) {
          setSubscriptionPlan(sortedSubsPlans);
        }
    }
}, [subscriptionPlan, userData?.subscriptionData]);


  useEffect(() => {
    getUserData();
    getSubscriptions()
  }, [router?.query])

  function Planchange(id) {
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
        text: id == 1 ? "Are you sure you want to go back to basic plan?" :
          id == 2 ? "Are you sure you want to upgrade to premium plan?" :
            "Are you sure you want to upgrade to super plan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (id == 1) {
            handleDowngrade(id);
          } else if (id == 2 || id == 3) {
            handleUpgrade(id);
          }
        }
      });
  }


  const handleUpgrade = (id) => {
    setSubscriptionsPlan(
      accessToken,
      user_id,
      id
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
        getUserData();
      });
  }


  const handleDowngrade = () => {
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
        getUserData();
      });
  }

  return (
    <>
      <div className="pb-5">
        <Seo title={"Subscription"} />

        <Row className="row-sm">

          {subscriptionPlan &&
            subscriptionPlan.map((data, index) => (
              <Col xl={6} lg={6} md={6} sm={12} className="  mt-4" key={index}>
                <Card className={`card custom-card card-img-top-1 p-4 h-100 m-0 ${data.package_price == 0 ? '' : 'premium-plan-card'}`}>

                  <Card.Body className="p-0">
                    <div>

                      <div>
                        <h4 className="text-primary tx-42">{data?.package_name}</h4>

                        <span className="tx-20 text-color-3">
                          {data?.package_price === '0' ? 'Free' : `$${data?.package_price}/${data?.duration}`}

                        </span>
                      </div>

                      <div className="mt-3 tx-17 text-color-3">
                        {data?.description}
                      </div>

                      <div className="mt-3">
                        {data?.subDescription &&
                          data?.subDescription.map((subData, subindex) => (
                            <div className="d-flex align-items-center mb-2" key={subindex}>
                              <i className="fa fa-check-circle tx-16 text-green">
                              </i>
                              <span className="font-weight-semibold ms-2 tx-17">
                                {subData}
                              </span>

                            </div>
                          ))
                        }

                      </div>

                      <div className={`mt-4 d-flex align-items-center pt-3 subBtnWidth`}>

                        {data?.package_price === '0' ?
                          userData?.subscriptionData === null ? (
                            <>
                              <i className="fe fe-check font-weight-bold"></i>
                              <span className="ms-2 font-weight-semibold">Current plan</span>
                            </>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => Planchange(data?.id)}
                              className="w-100 text-white btn btn-primary tx-18 tx-normal"
                            >
                              Go back to Basic
                            </Button>
                          )
                          :
                          data?.package_name === 'Premium' ?
                            userData?.subscriptionData?.plan_id === 2 ? (
                              <>
                                <i className="fe fe-check font-weight-bold"></i>
                                <span className="ms-2 font-weight-semibold">Current plan</span>
                              </>
                            ) : (
                              <Button
                                className="w-100 text-white btn btn-primary tx-18 tx-normal"
                                onClick={() => Planchange(data?.id)}
                              >
                                {userData?.subscriptionData?.plan_id === 3 ? 'Go back to Premium' : 'Upgrade to Premium'}
                              </Button>
                            )
                            :
                            data?.package_name === 'Super' && userData?.subscriptionData?.plan_id === 3 ? (
                              <>
                                <i className="fe fe-check font-weight-bold"></i>
                                <span className="ms-2 font-weight-semibold">Current plan</span>
                              </>
                            ) : (
                              <Button
                                className="w-100 text-white btn btn-primary tx-18 tx-normal"
                                onClick={() => Planchange(data?.id)}
                              >
                                Upgrade to Super
                              </Button>
                            )
                        }
                      </div>

                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}

          <ToastContainer />
        </Row>

      </div >
    </>
  );
};

OtherPlans.propTypes = {};

OtherPlans.defaultProps = {};

OtherPlans.layout = "Contentlayout";

export default OtherPlans;
