import Head from "next/head";
import favicon from "public/assets/img/brand/favicon.png";
import { Col, Form, Row, Button } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import Seo from "@/shared/layout-components/seo/seo";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { requestPassword } from "../../shared/services/Admin_Apis/auth/authCrud";

const initialValues = {
  email: '',
};

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
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
    email: Yup.string()
      .email("Wrong email format")
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      requestPassword(values.email)
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
      <Seo title={"forgot-password"} />


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
                          <div className="mb-4 text-center">
                            {" "}
                            <img
                              src={"../../../assets/img/logo.png"}
                              className="sign-favicon ht-40"
                              alt="logo"
                            />
                          </div>
                          <div className="main-card-signin-admin d-md-flex bg-white">
                            <div className="wd-100p">
                              <div className="main-signup-header">
                                <h3 className="text-center mb-4">Forgot Password!</h3>
                                <Form onSubmit={formik.handleSubmit}>
                                  <div className="form-group">
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
                                  </div>
                                  <Button variant="" className="btn btn-primary btn-block" type="submit">
                                    <span>Send</span>
                                  </Button>
                                </Form>
                              </div>
                              <div className="main-signup-footer mg-t-20 text-center">
                                <p>
                                  Forget it, <Link href="/admin/login"> Send me back</Link> to
                                  the sign in screen.
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
