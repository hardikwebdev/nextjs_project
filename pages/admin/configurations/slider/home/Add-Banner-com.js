import React, { useState, useEffect } from "react";
import {
  Spinner,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Row,
  InputGroup,
} from "react-bootstrap";
import Link from "next/link";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)
import "filepond/dist/filepond.min.css";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setSliderType } from "@/shared/redux/actions/authAction";

import { createSlider, updateSlider } from "@/shared/services/Admin_Apis/slider/sliderCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import QuillEditor from "@/components/QuillEditor";


const AddBanner = () => {
  const [status, setStatus] = useState(1);
  const [filesImage, setFilesImage] = useState([]); // to upload image
  const [base64ImageArr, setBase64ImageArr] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // to show image preview
  const [textBtnAlignment, setTextBtnAlignment] = useState("left")
  const [buttonFields, setButtonFields] = useState([]);
  const [defaultButtonValues, setDefaultButtonValues] = useState({ name: "", url: "" });
  const [longDiscContent, setLongDiscContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgUploadError, setImgUploadError] = useState("")

  const dispatch = useDispatch(); // Get the dispatch function
  let navigate = useRouter();
  const router = useRouter();
  const { mode, data } = router.query;
  const sliderData = data ? JSON.parse(decodeURIComponent(data)) : null;

  const accessToken = useSelector((state) => state?.userData?.access_token);


  useEffect(() => {
    if (filesImage?.length === 0) {
      setImgUploadError("")
      if (mode === "edit") {
        setBase64ImageArr(sliderData?.media)
        formik.setFieldValue("image", sliderData?.media);
      }
    }
  }, [filesImage])

  const handleAddMore = () => {
    if (mode != "edit" && buttonFields.length < 2) {
      const newButtonId = buttonFields.length + 1;
      const newButton = { id: newButtonId, name: "", url: "" };
      setButtonFields([...buttonFields, newButton]);
    } else if (mode === "edit" && buttonFields.length < 3) {
      const newButtonId = buttonFields.length + 1;
      const newButton = { id: newButtonId, name: "", url: "" };
      setButtonFields([...buttonFields, newButton]);
    } else {
      Swal.fire({
        title: "Warning",
        text: "You can't add more than 3 buttons",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Close",
        cancelButtonColor: "#d33",
      })
    }
  };

  const handleRemoveButton = (name, index) => {
    const updatedButtons = buttonFields.filter((button, btnIndex) => {
      return (btnIndex != index);
    });
    setButtonFields(updatedButtons);
  };

  const handleNameChange = (ind, value) => {
    const updatedButtons = buttonFields.map((button, index) => {
      if (index === ind) {
        return { ...button, name: value };
      }
      return button;
    });
    setButtonFields(updatedButtons);
  };

  const handleUrlChange = (ind, value) => {
    const updatedButtons = buttonFields.map((button, index) => {
      if (index === ind) {
        return { ...button, url: value };
      }
      return button;
    });
    setButtonFields(updatedButtons);
  };


  const combineButtonValues = () => {
    const combinedValues = [defaultButtonValues, ...buttonFields];
    const combinedValuesWithoutId = combinedValues.map((button) => ({
      name: button.name.trim(),
      url: button.url.trim(),
    }));
    const combinedValuesWithoutIdFiltered = combinedValuesWithoutId.filter((button) => button.name.length > 0 && button.url.length > 0);
    return combinedValuesWithoutIdFiltered;
  };


  useEffect(() => {
    if (mode === "edit" && sliderData && sliderData.buttons) {
      const buttonsArray = JSON.parse(sliderData.buttons);
      setButtonFields(buttonsArray);
    }
  }, [mode])



  /* use router for edit */


  const handleAlignment = (align) => {
    setTextBtnAlignment(align)
  }




  /* File upload and preview function */

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      fileItems.forEach((fileItem) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBase64ImageArr(e.target.result);
          formik.setFieldValue("image", e.target.result); // Update the Formik form values
        };
        reader.readAsDataURL(fileItem.file);
      });

    }
    else {
      setBase64ImageArr();
      // setImagePreview(null);
      formik.setFieldValue("image", ""); // Update the Formik form values
    }
    setFilesImage(fileItems);
  };


  useEffect(() => {
    setImagePreview(sliderData?.media)
    setBase64ImageArr(sliderData?.media)

    if (mode === "edit" && sliderData && sliderData.sub_text) {
      const sub_text = sliderData.sub_text;
      setLongDiscContent(sub_text);
    }
    if (mode === "edit" && sliderData && sliderData.text_button_alignment) {
      // Assuming that content_type in blogData can be "Paid" or "Free"
      const text_button_alignment
        = sliderData.text_button_alignment;
      setTextBtnAlignment(text_button_alignment);
    }
  }, [mode]);



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
    image: Yup.mixed().required("Image is required"), // Add this line
  });

  const initialValues = {
    headerText:
      sliderData && sliderData.header_text ? sliderData.header_text : "", // Check if title exists in sliderData
    sub_text: sliderData && sliderData.sub_text ? sliderData.sub_text : "",
    image: sliderData && sliderData.media ? sliderData.media : "",
  };


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setSubmitting }) => {
      const combinedButtonValues = combineButtonValues();
      setLoading(true);
      document.getElementById("submitButton").disabled = true;
      if (mode === "edit") {
        updateSlider(
          accessToken,
          sliderData.id,
          values.headerText,
          longDiscContent,
          base64ImageArr ? base64ImageArr : sliderData.media,
          textBtnAlignment,
          "home",
          sliderData.status,
          combinedButtonValues
        )
          .then(({ data }) => {
            toast.success(data?.message, {
              theme: "dark",
            });
            setTimeout(() => {
              let path = `/admin/configurations/slider`;
              navigate.push(path);
            }, 2500)
            dispatch(setSliderType("home"))
          })
          .catch((error) => {
            toast.error(error?.response?.data?.description, {
              theme: "dark",
            });
          })
          .finally(() => {
            setSubmitting(false);
            setLoading(false)
          });
      } else {
        createSlider(
          accessToken,
          values.headerText,
          longDiscContent,
          base64ImageArr,
          textBtnAlignment,
          "home",
          status,
          combinedButtonValues,
        )
          .then(({ data }) => {
            toast.success(data?.message, {
              theme: "dark",
            });
            setTimeout(() => {
              let path = `/admin/configurations/slider`;
              navigate.push(path);
            }, 2500)
            dispatch(setSliderType("home"))
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.message, {
              theme: "dark",
            });
          })
          .finally(() => {
            setSubmitting(false);
            setLoading(false)
          });
      }
    },
  });



  return (
    <div className="pb-4">

      {/* Banner title start */}
      <Card className="mt-4">
        <Card.Body className="py-0">
          <div className="breadcrumb-header justify-content-between">
            <div className="left-content">
              <span className="main-content-title mg-b-0 mg-b-lg-1">
                {mode === "edit" ? "Edit home banner" : "Add home banner"}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
      {/* Banner title end */}
      <Form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission
          formik.handleSubmit(); // Trigger form submission
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

                  {/* Sub text start */}
                  <Col md={12} className="mt-2">
                    <FormGroup>
                      <Form.Label className="form-label text-dark">
                        Sub text
                      </Form.Label>
                      <div className="ql-wrapper border blog-news-editor">
                        <QuillEditor onContentChange={(data) => {
                          setLongDiscContent(data);
                        }} longDiscContent={longDiscContent} isSlider={true}/>

                      </div>
                    </FormGroup>
                  </Col>
                  {/* Sub text end */}
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
                    <FormGroup className="px-3 pb-3 border form-group">
                      <Form.Label className="form-label text-dark">
                        Banner image
                      </Form.Label>
                      {imagePreview && (
                        <div className="my-3 text-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="preview-image"
                          />
                        </div>
                      )}
                      <FilePond
                        files={filesImage}
                        allowReorder={true}
                        allowMultiple={false} // Adjust to your requirements
                        allowFileTypeValidation={true}
                        acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
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
                      {formik.touched.image && formik.errors.image && (
                        <div className="text-danger">
                          {formik.errors.image}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  {/* Banner image upload end */}


                  {mode != "edit" &&
                    <Col md={12} className="mt-3">
                      <div className="border p-4">
                        <FormGroup>
                          <InputGroup className="input-group mb-3">
                            <InputGroup.Text className="input-group-text">
                              Button Name
                            </InputGroup.Text>
                            <Form.Control
                              className="form-control"
                              id="BtnName"
                              placeholder="Enter Button Name"
                              // pattern="^\s*\S.*\S\s*$"
                              // title="Whitespaces are not allowed"
                              type="text"
                              name="buttonName"
                              value={defaultButtonValues.name}
                              onChange={(e) => setDefaultButtonValues({ ...defaultButtonValues, name: e.target.value })}
                            />
                          </InputGroup>
                          <InputGroup className="input-group">
                            <InputGroup.Text className="input-group-text">
                              Button URL
                            </InputGroup.Text>
                            <Form.Control
                              className="form-control"
                              id="BtnUrl"
                              pattern="^\s*https?://\S.*\S\s*$"
                              title="Enter a valid URL starting with http:// or https://, Whitespaces are not allowed"
                              placeholder="https://example.com/"
                              type="text"
                              name="buttonUrl"
                              value={defaultButtonValues.url}
                              onChange={(e) => setDefaultButtonValues({ ...defaultButtonValues, url: e.target.value })}
                            />
                          </InputGroup>
                        </FormGroup>
                      </div>
                    </Col>
                  }
                  {buttonFields.map((button, index) => (
                    <>
                      <Col md={12} className="mt-3" key={button.id}>
                        <div className="border p-4">
                          <FormGroup>
                            <InputGroup className="input-group mb-3">
                              <InputGroup.Text className="input-group-text">
                                Button Name
                              </InputGroup.Text>
                              <Form.Control
                                className="form-control"
                                placeholder="Enter Button Name"
                                type="text"
                                // pattern="^\s*\S.*\S\s*$"
                                // title="Whitespaces are not allowed"
                                value={button.name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                              />
                            </InputGroup>
                            <InputGroup className="input-group">
                              <InputGroup.Text className="input-group-text">
                                Button URL
                              </InputGroup.Text>
                              <Form.Control
                                className="form-control"
                                placeholder="https://example.com/"
                                type="text"
                                pattern="^\s*https?://\S.*\S\s*$"
                                title="Enter a valid URL starting with http:// or https://, Whitespaces are not allowed"
                                value={button.url}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                              />
                            </InputGroup>
                            <span className="position-absolute cursor-pointer text-danger "
                              style={{ top: "-8px", right: "1px" }}
                              onClick={() => handleRemoveButton(button.name, index)}>
                              <i className="fe fe-x-circle tx-20 bg-white"></i>
                            </span>
                          </FormGroup>

                        </div>
                      </Col>
                    </>
                  ))}

                  <Col lg={12} className="mt-1">
                    <div className="text-primary d-flex align-items-center justify-content-end">
                      <a href="#" className="d-flex align-items-center" onClick={handleAddMore}>
                        <i className="fe fe-plus me-1"></i>
                        <span>Add more</span>
                      </a>
                    </div>
                  </Col>
                  {/* Add more button end */}

                  {/* Text alignment start */}
                  <Col md={12}>
                    <FormGroup>
                      <Form.Label className="form-label text-dark">
                        Text and button alignment
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
