import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import Seo from "@/shared/layout-components/seo/seo";
import { otpSubmit, resendOtp } from "../../shared/services/Admin_Apis/auth/authCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { setUserData } from "@/shared/redux/actions/authAction";
import { useDispatch, useSelector } from 'react-redux'; // Import the useDispatch hook

const initialValues = {
  otp: '',
};


export default function OtpVerification() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch(); // Get the dispatch function
  // const { email } = router.query;
  const email = useSelector((state) => state?.OtpEmail);

  console.log(email);
  useEffect(() => {
    if (document.body) {
      document
        .querySelector("body")
        .classList.add("ltr", "error-page1", "bg-primary-admin");
    }

    return () => {
      document.body.classList.remove("ltr", "error-page1", "bg-primary-admin");
    };
  }, []);


  const routeChange = () => {
    let path = `/admin/dashboard/`;
    router.push(path);
  };

  const resened = () => {
    setLoading(true);
    resendOtp(email)
      .then(({ data }) => {
        toast.success(data?.message, {
          theme: "dark",
        });

      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error?.response.data.description, {
          theme: "dark",
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000)
      });
  }




  const formik = useFormik({
    initialValues,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      otpSubmit(email, values.otp)
        .then(({ data }) => {
          toast.success(data?.message, {
            theme: "dark",
          });
          dispatch(setUserData(data));
          routeChange();
        })
        .catch((error) => {
          console.log("error", error);
          toast.error(error?.response.data.description, {
            theme: "dark",
          });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
            setSubmitting(false);
          }, 2000)
        });
    },
  });

  return (
    <>

      <Seo title={"Verification"} />


      <div className="page">
        {loading ? (
          <div className="text-wrap d-flex justify-content-center">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <>
            <div className="square-box">
              {" "}
              <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
              <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
              <div></div> <div></div> <div></div>{" "}
            </div>
            <div className="page-single">
              <div className="container">
                <Row>
                  <Col
                    xl={5}
                    lg={6}
                    md={8}
                    sm={8}
                    xs={10}
                    className=" card-sigin-main py-4 justify-content-center mx-auto"
                  >
                    <div className="card-sigin-admin">
                      {/* <!-- Demo content--> */}
                      <div className="main-card-signin-admin d-md-flex">
                        <div className="wd-100p">
                          <div className="main-card-signin-admin d-md-flex bg-white">
                            <div className="wd-100p">
                              <div className="main-signup-header">
                                <h3 className="text-center mb-4">OTP Verification!</h3>
                                <Form onSubmit={formik.handleSubmit}>
                                  <div className="form-group">
                                    <Form.Control
                                      className="form-control"
                                      placeholder="Please enter OTP"
                                      type="text"
                                      name="otp"
                                      value={formik.values.otp}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                  </div>
                                  <Button variant="" className="btn btn-primary btn-block" type="submit">
                                    <span>Submit</span>
                                  </Button>
                                </Form>
                              </div>
                              <div className="main-signup-footer mg-t-20 text-end">
                                <p>
                                  <span className="text-primary tx-14 font-weight-semibold cursor-pointer"
                                    onClick={() => resened()}
                                  >Resend OTP</span>

                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
        <ToastContainer />
      </div>
    </>
  );
}