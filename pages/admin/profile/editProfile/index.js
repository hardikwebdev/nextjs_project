import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, FormGroup, Button, Spinner } from "react-bootstrap";
import { getProfileData } from "@/shared/services/Admin_Apis/profile/profileCrud";
import { useSelector } from "react-redux";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginImageExifOrientation, FilePondPluginFileValidateSize)
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { updateProfile } from "@/shared/services/Admin_Apis/profile/profileCrud";
import { setUserData } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { useRouter } from "next/router";


export default function EditProfile() {
  const [profileData, setProfileData] = useState();
  const [filesImage, setFilesImage] = useState([]); // to upload image
  const [imgUploadError, setImgUploadError] = useState("")
  const [base64ImageArr, setBase64ImageArr] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // to show image preview
  const [loading, setLoading] = useState(false);
  const access_token = useSelector((state) => state?.userData?.access_token);
  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useRouter();

  useEffect(() => {
    if (filesImage?.length === 0) {
      setImgUploadError("")
      console.log(profileData);
      setBase64ImageArr(profileData?.profile_url)
    }
  }, [filesImage])

  const getData = () => {
    getProfileData(access_token)
      .then(({ data }) => {
        setProfileData(data.userProfileData);
        setImagePreview(data.userProfileData.profile_url)
        setBase64ImageArr(data.userProfileData.profile_url)
        dispatch(setUserData({ access_token, data }));

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


  /* File upload and preview function */
  // const handleFilePondUpdate = (fileItems) => {
  //   if (fileItems.length > 0) {
  //     fileItems.forEach((fileItem) => {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         // setImagePreview(e.target.result)
  //         setBase64ImageArr(e.target.result);
  //       };
  //       reader.readAsDataURL(fileItem.file);
  //     });
  //   }
  //   setFilesImage(fileItems);
  // };

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      fileItems.forEach((fileItem) => {
        if (fileItem && fileItem.file instanceof Blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setBase64ImageArr(e.target.result);
          };
          reader.readAsDataURL(fileItem.file);
        } else {
          console.error("Invalid fileItem or fileItem.file is not a Blob");
        }
      });
    } else {
      setBase64ImageArr();
    }
    setFilesImage(fileItems);
  };


  const initialValues = {
    FirstName: profileData ? profileData?.first_name : '',
    LastName: profileData ? profileData?.last_name : '',
    Bio: profileData ? profileData?.bio : '',
  };
  const Schema = Yup.object().shape({
    FirstName: Yup.string()
      .required("First name is required")
      .test(
        "no-leading-trailing-spaces",
        "First name cannot start or end with white spaces",
        (value) => {
          if (value) {
            // Trim white spaces from the input
            const trimmedValue = value.trim();
            return trimmedValue === value; // Check if the input has leading/trailing white spaces
          }
          return true; // Allow empty input
        }
      ),
    LastName: Yup.string()
      .required("Last name is required")
      .test(
        "no-leading-trailing-spaces",
        "Last name cannot start or end with white spaces",
        (value) => {
          if (value) {
            // Trim white spaces from the input
            const trimmedValue = value.trim();
            return trimmedValue === value; // Check if the input has leading/trailing white spaces
          }
          return true; // Allow empty input
        }
      ),
  });

  const handleRemoveImage = (imgSrc) => {
    const updatedImagePreview = (profileData.profile_url !== imgSrc);
    setImagePreview(updatedImagePreview);
    setBase64ImageArr("");
    setFilesImage()
  };

  useEffect(() => {
    const updatedInitialValues = {
      FirstName: profileData ? profileData?.first_name : '',
      LastName: profileData ? profileData?.last_name : '',
      Bio: profileData ? profileData?.bio : '',
    };
    formik.setValues(updatedInitialValues);

  }, [profileData]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      document.getElementById("submitButton").disabled = true;
      updateProfile(
        access_token,
        profileData.id,
        base64ImageArr,
        values.FirstName,
        values.LastName,
        profileData.email,
        values.Bio,
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
          document.getElementById("submitButton").disabled = false;
          setFilesImage()
          setSubmitting(false);
          getData();
          setLoading(false)
        });

    },
  });

  return (
    <div className="main-content-body tab-pane border-top-0">
      <Card>
        <Card.Body className="border-0 p-0">
          <Form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission
              formik.handleSubmit(); // Trigger form submission
            }}
            className="form-horizontal"
          >
            {/* {profileData.map((data, index) => ( */}
            <>
              <div className="mb-4 main-content-label">Personal Information</div>
              <FormGroup className="form-group ">
                <Row className="row-sm align-items-center ">
                  <Col md={3}>
                    <Form.Label className="form-label">
                      Profile image
                    </Form.Label>

                  </Col>
                  <Col md={5} xl={4} xxl={3}>
                    {imagePreview ? (
                      <div className="my-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="preview-image w-100"
                        />

                        <button
                          className="bg-danger text-white border-none w-100"
                          type="button"
                          onClick={() =>
                            handleRemoveImage(imagePreview)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                    <FilePond
                      files={filesImage}
                      allowReorder={true}
                      allowMultiple={false} // Adjust to your requirements
                      allowFileTypeValidation={true}
                      acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']} // Adjust to your desired file types
                      allowFileSizeValidation={true}
                      maxFileSize={10 * 1024 * 1024}
                      labelMaxFileSizeExceeded={'File is too large'}
                      onupdatefiles={handleFilePondUpdate}
                      labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                      name="image"
                      onerror={(error) => {
                        setImgUploadError(error)
                      }}
                    />
                  </Col>
                </Row>



              </FormGroup>
              <div className="border-top"></div>
              <FormGroup className="form-group mt-4">
                <Row className=" row-sm">
                  <Col md={3}>
                    <Form.Label className="form-label">First Name</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      className="form-control"
                      placeholder="First name"
                      type="text"
                      name="FirstName"
                      value={formik.values.FirstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.FirstName && formik.errors.FirstName && (
                      <div className="text-danger">{formik.errors.FirstName}</div>
                    )}
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup className="form-group ">
                <Row className=" row-sm">
                  <Col md={3}>
                    <Form.Label className="form-label">Last Name</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      className="form-control"
                      placeholder="Last name"
                      type="text"
                      name="LastName"
                      value={formik.values.LastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.LastName && formik.errors.LastName && (
                      <div className="text-danger">{formik.errors.LastName}</div>
                    )}
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup className="form-group ">
                <Row className=" row-sm">
                  <Col md={3}>
                    <Form.Label className="form-label">Designation</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      className="form-control"
                      placeholder="Designation"
                      defaultValue={profileData?.role === 0 ? 'Admin' : 'Tester'}
                      disabled
                    />
                  </Col>
                </Row>
              </FormGroup>
              <div className="mb-4 main-content-label">Contact Info</div>
              <FormGroup className="form-group ">
                <Row className=" row-sm">
                  <Col md={3}>
                    <Form.Label className="form-label">
                      Email
                    </Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      defaultValue={profileData?.email}
                      disabled
                    />
                  </Col>
                </Row>
              </FormGroup>

              <div className="mb-4 main-content-label">About Yourself</div>
              <FormGroup className="form-group ">
                <Row className=" row-sm">
                  <Col md={3}>
                    <Form.Label className="form-label">
                      Bio
                    </Form.Label>
                  </Col>
                  <Col md={9}>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Bio"
                      name="Bio"
                      value={formik.values.Bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <Row className="justify-content-end mt-3">
                <Col md={2}>
                  <Button variant="primary" type="submit" id="submitButton" className={`btn btn-primary w-100 ${imgUploadError ? 'disabled' : null}`}>

                    {loading ?
                      <Spinner animation="border"
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                      : "Submit"}
                  </Button>
                  {/* <Button
                    className="btn btn-primary w-100"
                    type="submit"
                  >
                    Submit
                  </Button> */}
                </Col>
              </Row>
            </>
            {/* ))} */}
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer />
    </div>
  );
}
