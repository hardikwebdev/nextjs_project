import Head from "next/head";
import favicon from 'public/assets/img/brand/favicon.png'
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Seo from "@/shared/layout-components/seo/seo";
import { login } from "../../shared/services/Admin_Apis/auth/authCrud";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { setUserData } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { useSelector } from "react-redux";
import { setOtpEmailForLogin } from "@/shared/redux/actions/authAction";
const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState(false)
  const router = useRouter();
  const dispatch = useDispatch(); // Get the dispatch function

  const accessToken = useSelector((state) => state?.userData?.access_token);

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


  let navigate = useRouter();
  const routeChange = () => {
    let path = `/admin/dashboard/`;
    navigate.push(path);
  };

  const routeChangeOtp = (email) => {
    router.push({
      pathname: "/admin/Otp-verification",
      // query: { email: email },
    });
    dispatch(setOtpEmailForLogin(email))
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
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

    password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setOtpEmail(values.email)
      setLoading(true);
      login(values.email, values.password)
        .then(({ data }) => {
          if (data?.access_token && data?.isTestUserLogin == false) {
            toast.success(data?.message, {
              theme: "dark",
            });

            dispatch(setUserData(data));
            setTimeout(() => {
              routeChange();
            }, 2500);
          }
          else {
            toast.success(data?.message, {
              theme: "dark",
            });
            routeChangeOtp(values.email);
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
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
            setSubmitting(false);
          }, 2000)
        });
    },
  });

  useEffect(() => {
    if (accessToken) {
      routeChange();
    }
  }, [accessToken]);
  return (
    <>
      <Head>
        <title>Next.js Project</title>
        <meta name="description" content="Spruha" />
        <link rel="icon" href={favicon.src} />
      </Head>
      <Seo title={"Login"} />


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
                    className="card-sigin-main mx-auto my-auto py-4 justify-content-center"
                  >
                    <div className="card-sigin-admin">
                      <div className="main-card-signin-admin d-md-flex">
                        <div className="wd-100p">
                          <div className="mb-4 text-center">
                            <img
                              src={"../../../assets/img/logo.png"}
                              className="sign-favicon ht-40"
                              alt="logo"
                            />
                          </div>
                          <div>
                            <div className="main-signup-header">
                              <h2 className="text-center mb-4">Sign In</h2>
                              <div className="panel panel-primary">
                                <div className="tab-menu-heading mb-2 border-bottom-0">
                                  <div className="tabs-menu1">
                                    <Form onSubmit={formik.handleSubmit}>
                                      <Form.Group className="form-group">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                          className="form-control"
                                          placeholder="Enter your email"
                                          type="text"
                                          name="email"
                                          value={formik.values.email}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.email && formik.touched.email && (
                                          <div className="text-danger">{formik.errors.email}</div>
                                        )}
                                      </Form.Group>
                                      <Form.Group className="form-group">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                          className="form-control"
                                          placeholder="Enter your password"
                                          type="password"
                                          name="password"
                                          // value={formik.values.password}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.password && formik.touched.password && (
                                          <div className="text-danger">{formik.errors.password}</div>
                                        )}
                                      </Form.Group>
                                      <Button variant="" className="btn btn-primary btn-block" type="submit">
                                        <span>Sign In</span>
                                      </Button>

                                    </Form>
                                  </div>
                                </div>
                              </div>

                              <div className="main-signin-footer text-end mt-3">
                                <p>
                                  <Link href="/admin/forgot-password" className="mb-3">
                                    Forgot password?
                                  </Link>
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
