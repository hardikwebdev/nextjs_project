import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Row,
  Spinner
} from "react-bootstrap";
import Link from "next/link";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)
import "filepond/dist/filepond.min.css";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getSliders, updateSlider } from "@/shared/services/Admin_Apis/slider/sliderCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setSliderType } from "@/shared/redux/actions/authAction";


const AddBanner = () => {
  const [filesImage, setFilesImage] = useState([]);
  const [base64ImageArr, setBase64ImageArr] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [textBtnAlignment, setTextBtnAlignment] = useState("left")
  const [data, setData] = useState("")
  const [loading, setLoading] = useState(false);
  const [imgUploadError, setImgUploadError] = useState("")
  const [removedImages, setRemovedImages] = useState(false); // To keep track of removed images

  const dispatch = useDispatch(); // Get the dispatch function
  useEffect(() => {
    if (filesImage?.length === 0) {
      setImgUploadError("")
      console.log(data);
      setBase64ImageArr(data[0]?.media)
      formik.setFieldValue("image", data[0]?.media);
    }
  }, [filesImage])



  let navigate = useRouter();
  const accessToken = useSelector((state) => state?.userData?.access_token);

  const getSliderData = () => {
    const page = 1;
    const pageSize = 1; // Adjust based on your items per page
    const sortBy = "createdAt";
    const sortOrder = "DESC";
    getSliders(accessToken, "blog", page, pageSize, sortBy, sortOrder)
      .then(({ data }) => {
        setData(data.sliderData);
        setBase64ImageArr(data.sliderData[0].media);
        setImagePreview(data.sliderData[0].media);
        setTextBtnAlignment(data.sliderData[0].text_button_alignment)
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
        if (error?.response?.data?.statusCode === 401) {
          dispatch(setUserData(null));
          let path = `/admin/login`;
          navigate.push(path);
        }

      })
  }
  useEffect(() => {
    getSliderData()
  }, [])

  const handleAlignment = (align) => {
    setTextBtnAlignment(align)
  }

  const handleRemoveImage = (imgSrc) => {
    // const updatedImagePreview = imagePreview.filter((image) => image !== imgSrc);
    setRemovedImages(true);
    // console.log(updatedImagePreview);
    setImagePreview("");
  };

  useEffect(() => {
    if (removedImages) {
      setBase64ImageArr("")
    }
  }, [handleRemoveImage]
  )
  /* File upload and preview function */
  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      fileItems.forEach((fileItem) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBase64ImageArr(e.target.result);
          formik.setFieldValue("image", e.target.result);
        };
        reader.readAsDataURL(fileItem.file);
      });
    } else {
      setBase64ImageArr();
      formik.setFieldValue("image", "");
    }
    setFilesImage(fileItems);
  };

  const Schema = Yup.object().shape({
    headerText: Yup.string()
      .required("Header text is required")
      .test(
        "no-leading-trailing-spaces",
        "Header text cannot start or end with white spaces",
        (value) => {
          if (value) {
            const trimmedValue = value.trim();
            return trimmedValue === value; // Check if the input has leading/trailing white spaces
          }
          return true; // Allow empty input
        }
      ),

  });

  const initialValues = {
    headerText: data ? data[0]?.header_text : "",
    image: data ? data[0].media : "",
  };

  useEffect(() => {
    formik.setValues(initialValues);
  }, [data]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      document.getElementById("submitButton").disabled = true;

      updateSlider(
        accessToken,
        data[0].id,
        values.headerText,
        data[0].sub_text,
        base64ImageArr,
        textBtnAlignment,
        data[0].slider_type,
        data[0].status,
        data[0].buttons,
        removedImages
      )
        .then(({ data }) => {
          toast.success(data?.message, {
            theme: "dark",
          });
          setTimeout(() => {
            let path = `/admin/configurations/slider`;
            navigate.push(path);
          }, 2500)

          dispatch(setSliderType("blog"))
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
          setSubmitting(false);
          setLoading(false);
        });
    },
  });



  return (
    <div className="pb-4">

      <Card className="mt-4">
        <Card.Body className="py-0">
          <div className="breadcrumb-header justify-content-between">
            <div className="left-content">
              <span className="main-content-title mg-b-0 mg-b-lg-1">
                Edit Blog
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >

        <Row>
          {/* Header and subtext form start */}
          <Col lg={7} md={7}>
            <Card className="shadow-search">
              <Card.Body>
                <Row>
                  {/* Header text start */}
                  <Col md={12}>
                    <FormGroup>
                      <Form.Label className="form-label text-dark">
                        Header text
                      </Form.Label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter header text"
                        name="headerText"
                        value={formik.values.headerText}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.headerText &&
                        formik.touched.headerText && (
                          <div className="text-danger">
                            {formik.errors.headerText}
                          </div>
                        )}
                    </FormGroup>
                  </Col>
                  {/* Header text end */}

                </Row>
              </Card.Body>
            </Card>
          </Col>
          {/* Header and subtext form end */}

          {/* Banner image, text alignment, add buttons, save and publish form start */}
          <Col lg={5} md={5}>
            <Card className="right-bar-sticky shadow-search">
              <Card.Body>
                {/* Banner image, text alignment, add buttons start */}
                <Row>
                  {/* Banner image upload start */}
                  <Col md={12}>
                    <Form.Label className="form-label text-dark">
                      Banner image
                    </Form.Label>
                    <FormGroup className="px-3 py-3 border form-group">
                      {imagePreview ? (
                        <>
                          {imagePreview && (
                            <div className="d-flex flex-column m-3">
                              <img
                                src={imagePreview}
                                alt={`Image`}
                                className="preview-image"
                              />
                              <button
                                className="bg-danger text-white border-none"
                                type="button"
                                onClick={() =>
                                  handleRemoveImage(imagePreview)
                                }
                              >
                                Remove
                              </button>
                            </div>
                            // <div className="my-3 text-center">
                            //   <img
                            //     src={imagePreview}
                            //     alt="Preview"
                            //     className="preview-image"
                            //   />
                            // </div>
                          )}
                        </>
                      ) : null}
                      <FilePond
                        files={filesImage}
                        allowReorder={true}
                        allowMultiple={false} // Adjust to your requirements
                        allowFileTypeValidation={true}
                        maxFileSize={10 * 1024 * 1024}
                        labelMaxFileSizeExceeded={'File is too large'}
                        acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']} // Adjust to your desired file types
                        onupdatefiles={handleFilePondUpdate}
                        labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                        name="image"
                        onerror={(error) => {
                          setImgUploadError(error)
                        }}
                      />
                    </FormGroup>
                  </Col>
                  {/* Banner image upload end */}


                  {/* Text alignment start */}
                  <Col md={12}>
                    <FormGroup>
                      <Form.Label className="form-label text-dark">
                        Text alignment
                      </Form.Label>
                      <div className="d-md-flex flex-wrap">
                        {textBtnAlignment === "left" ?
                          (
                            <Form.Label className="custom-control custom-radio me-4">
                              <input
                                type="radio"
                                className="custom-control-input"
                                name="radio2"
                                defaultevalue="option1"
                                defaultChecked
                                onClick={() => { handleAlignment("left") }}
                              />
                              <span className="custom-control-label">Left</span>
                            </Form.Label>
                          ) : (
                            <Form.Label className="custom-control custom-radio me-4">
                              <input
                                type="radio"
                                className="custom-control-input"
                                name="radio2"
                                defaultevalue="option1"
                                onClick={() => { handleAlignment("left") }}
                              />
                              <span className="custom-control-label">Left</span>
                            </Form.Label>
                          )}

                        {textBtnAlignment === "center" ? (
                          <Form.Label className="custom-control custom-radio me-4">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="radio2"
                              defaultevalue="option2"
                              defaultChecked
                              onClick={() => { handleAlignment("center") }}
                            />
                            <span className="custom-control-label">Center</span>
                          </Form.Label>
                        ) : (
                          <Form.Label className="custom-control custom-radio me-4">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="radio2"
                              defaultevalue="option2"
                              onClick={() => { handleAlignment("center") }}
                            />
                            <span className="custom-control-label">Center</span>
                          </Form.Label>
                        )}

                        {textBtnAlignment === "right" ? (
                          <Form.Label className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="radio2"
                              defaultevalue="option3"
                              defaultChecked
                              onClick={() => { handleAlignment("right") }}
                            />
                            <span className="custom-control-label">Right</span>
                          </Form.Label>
                        ) : (
                          <Form.Label className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="radio2"
                              defaultevalue="option3"
                              onClick={() => { handleAlignment("right") }}
                            />
                            <span className="custom-control-label">Right</span>
                          </Form.Label>
                        )}

                      </div>
                    </FormGroup>
                  </Col>
                  {/* Text alignment end */}
                </Row>
                {/* Banner image, text alignment, add buttons end */}

                <div className="horizontal-row my-3"></div>

                {/* Preview, save as draft, publish buttons row start */}
                <Row>
                  {/* Save as draft button start */}
                  <Col lg={6} className="mt-3">
                    <div>
                      <Link href="/admin/configurations/slider">
                        <button
                          className="btn btn-danger w-100"
                        >
                          Cancel
                        </button>
                      </Link>
                    </div>
                  </Col>
                  {/* Save as draft button end */}

                  {/* Publish button start */}
                  <Col lg={6} className="mt-3">
                    <div>
                      <Button variant="primary" type="submit" id="submitButton" className={`btn btn-primary w-100 ${imgUploadError ? 'disabled' : null} ${loading ? 'disabled' : null}`}>

                        {loading ?
                          <Spinner animation="border"
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                          : "Submit"}
                      </Button>
                      {/* <Button className="btn btn-primary w-100" type="submit">
                        Submit
                      </Button> */}
                    </div>
                  </Col>
                  {/* Publish button end */}
                </Row>
                {/* Preview, save as draft, publish buttons row start */}
              </Card.Body>
            </Card>
          </Col>
          {/* Banner image, text alignment, add buttons, save and publish form start */}
        </Row>
      </Form>
      <ToastContainer />
    </div >
  );
};

export default AddBanner;
