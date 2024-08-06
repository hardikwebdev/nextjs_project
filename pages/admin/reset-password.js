import Head from "next/head";
import favicon from "public/assets/img/brand/favicon.png";
import { Col, Form, Row, Button } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import Seo from "@/shared/layout-components/seo/seo";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from "../../shared/services/Admin_Apis/auth/authCrud";
import { useRouter } from "next/router";


const initialValues = {
  newPassword: '',
  ConfirmPassword: '',
};

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { email, resetToken } = router.query;

  console.log("email", email);
  console.log("resetToken", resetToken);
  
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

  const LoginSchema = Yup.object().shape({
    newPassword: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long'
      )
      .required('Password is required'),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Password must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      
      resetPassword(email, values.newPassword, resetToken)
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
            setSubmitting(false);
          }, 2000)
        });
    },
  });

  return (
    <>
      <Head>
        <title>Next.js Project</title>
        <meta name="description" content="Spruha" />
        <link rel="icon" href={favicon.src} />
        {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"></link> */}
      </Head>
      <Seo title={"reset-password"} />
      <div className="square-box">
        {" "}
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
        <div></div> <div></div> <div></div>{" "}
      </div>

      <div className="page">
        {loading ? (
          <div className="text-wrap d-flex justify-content-center">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <div className="page-single">
            <div className="container">
              <Row>
                <Col
                  xl={5}
                  lg={6}
                  md={8}
                  sm={8}
                  xs={10}
                  className="card-sigin-main py-4 justify-content-center mx-auto"
                >
                  <div className="card-sigin">
                    <div className="main-card-signin d-md-flex">
                      <div className="wd-100p">
                        <div className="mb-4 text-center">
                          {" "}
                          <img
                            src={"../../../assets/img/logo.png"}
                            className="sign-favicon ht-40"
                            alt="logo"
                          />
                        </div>
                        <div className="  mb-1">
                          <div className="main-signin-header">
                            <div className="">
                              <h2 className="text-center mb-4">Reset Your Password</h2>
                              <Form onSubmit={formik.handleSubmit}>
                                <div className="text-start form-group">
                                  <Form.Label>New Password</Form.Label>
                                  <Form.Control
                                    className="form-control"
                                    placeholder="Enter your password"
                                    type="password"
                                    name="newPassword"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                  {formik.errors.newPassword && formik.touched.newPassword && (
                                    <div className="text-danger">{formik.errors.newPassword}</div>
                                  )}
                                </div>
                                <div className="text-start form-group">
                                  <Form.Label>Confirm Password</Form.Label>
                                  <Form.Control
                                    className="form-control"
                                    placeholder="Enter your password"
                                    type="password"
                                    name="ConfirmPassword"
                                    value={formik.values.ConfirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                  {formik.errors.ConfirmPassword && formik.touched.ConfirmPassword && (
                                    <div className="text-danger">{formik.errors.ConfirmPassword}</div>
                                  )}
                                </div>
                                <Button variant="" className="btn btn-primary btn-block" type="submit">
                                  <span>Reset Password</span>
                                </Button>
                                <ToastContainer />
                              </Form>

                            </div>
                          </div>
                          <div className="main-signup-footer mg-t-20 text-center">
                            <p>
                              Already have an account?{" "}
                              <Link href={`/admin/auth/login`}>
                                Sign In
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
