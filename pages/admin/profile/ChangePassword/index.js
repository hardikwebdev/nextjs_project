import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, FormGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getProfileData, updateProfile } from "@/shared/services/Admin_Apis/profile/profileCrud";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

export default function ChangePassword() {
    const [profileData, setProfileData] = useState('');
    const [showFirstDiv, setShowFirstDiv] = useState(true);
    const accessToken = useSelector((state) => state?.userData?.access_token);

    
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


    const handleResetPasswordClick = () => {
        setShowFirstDiv(false);
    }
    const handleCancelClick = () => {
        setShowFirstDiv(true);
    }
    const Schema = Yup.object().shape({
        oldPassword: Yup.string().required("Current Password is required"),
        newpassword: Yup.string()
            .required("New Password is required")
            .min(8, "New Password must be at least 8 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                "New Password must include at least 1 uppercase letter and 1 special character"
            ),
        confirmpassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("newpassword")], "Password must match"),
    });

    const initialValues = {
        oldPassword: '',
        newpassword: '',
        confirmpassword: '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setSubmitting }) => {
            updateProfile(
                accessToken,
                profileData.id,
                profileData.profile_url,
                profileData.first_name,
                profileData.last_name,
                profileData.email,
                profileData.bio,
                values.confirmpassword,
                values.oldPassword,
            )
                .then(({ data }) => {
                    toast.success('Password updated successfully', {
                        theme: "dark",
                    });
                    setShowFirstDiv(true);
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.description, {
                        theme: "dark",
                    });
                })
                .finally(() => {
                    formik.resetForm();
                    setSubmitting(false);
                    getData();
                });

        },
    });


    return (
        <div className="main-content-body tab-pane active">
            <div className="card-header border-0 py-3" role="button" data-bs-toggle="collapse" data-bs-target="#kt_account_signin_method">
                <div className="text-primary m-0">
                    <h4 className="fw-bolder m-0">Change Password</h4>
                </div>
            </div>
            <div className="border-bottom mt-1"></div>
            <Card className="card mb-5 mb-xl-10">
                {showFirstDiv ? (
                    <Card.Body className="p-9 mt-4">
                        <div className="d-flex flex-wrap align-items-center mb-10">
                            <div>
                                <div className="fs-6 font-weight-bolder mb-1">Password</div>
                                <div className="font-weight-bold text-muted">************</div>
                            </div>
                            <div className="ms-auto">
                                <button onClick={handleResetPasswordClick} className="btn btn-light btn-active-light-primary">Reset Password</button>
                            </div>
                        </div>
                    </Card.Body>

                ) : null}
                {!showFirstDiv && (
                    <Card.Body className="px-0 px-md-4 mt-2">
                        {/* <div className="flex-row-fluid false"> */}
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent the default form submission
                                formik.handleSubmit(); // Trigger form submission
                            }}
                        >
                            <Row className="row-sm">
                                <Col md={4}>
                                    <FormGroup className="form-group">
                                        <Form.Label className="form-label font-weight-bolder" htmlFor="oldPassword">
                                            Current Password
                                        </Form.Label>
                                        <Form.Control
                                            className="form-control"
                                            placeholder="Current Password"
                                            type="password"
                                            name="oldPassword"
                                            id="oldPassword"
                                            autoComplete="off"
                                            // value={formik.values.oldPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.oldPassword && formik.errors.oldPassword && (
                                            <div className="text-danger">{formik.errors.oldPassword}</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup className="form-group">
                                        <Form.Label className="form-label font-weight-bolder" htmlFor="newpassword">
                                            New Password
                                        </Form.Label>
                                        <Form.Control
                                            className="form-control"
                                            placeholder="New Password"
                                            type="password"
                                            name="newpassword"
                                            id="newpassword"
                                            autoComplete="off"
                                            // value={formik.values.newpassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />

                                        {formik.touched.newpassword && formik.errors.newpassword && (
                                            <div className="text-danger">{formik.errors.newpassword}</div>
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup className="form-group">
                                        <Form.Label className="form-label font-weight-bolder" htmlFor="confirmpassword">
                                            Confirm New Password
                                        </Form.Label>
                                        <Form.Control
                                            className="form-control"
                                            placeholder="Confirm New Password"
                                            type="password"
                                            id="confirmpassword"
                                            name="confirmpassword"
                                            autoComplete="off"
                                            // value={formik.values.confirmpassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                                            <div className="text-danger">{formik.errors.confirmpassword}</div>
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <div className="text-end mt-4">
                                <Button onClick={handleCancelClick} variant="danger" type="button" className="me-4">Cancel</Button>
                                <Button type="submit" className="px-6">Update Password</Button>
                            </div>
                        </Form>
                        {/* </div> */}
                    </Card.Body>
                )}
            </Card>
            <ToastContainer />
        </div>
    );
}
