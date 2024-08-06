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
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize, FilePondPluginImagePreview)
import "filepond/dist/filepond.min.css";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { getHomeBlock, updateHomeBlock } from "../../../../../shared/services/Admin_Apis/homeBlock/homeBlockCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { setSliderType } from "../../../../../shared/redux/actions/authAction";


const AddBanner = () => {
  const [filesImage, setFilesImage] = useState([]);
  const [base64ImageArr, setBase64ImageArr] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState("")
  const [loading, setLoading] = useState(false);
  const [imgUploadError, setImgUploadError] = useState("")

  const dispatch = useDispatch(); // Get the dispatch function


  useEffect(() => {
    if (filesImage?.length === 0) {
      setImgUploadError("")
      console.log(data);
      setBase64ImageArr(data?.media)
      formik.setFieldValue("image", data?.media);
    }
  }, [filesImage])

  let navigate = useRouter();
  const accessToken = useSelector((state) => state?.userData?.access_token);

  const getData = () => {
    getHomeBlock(accessToken, "tipblock")
      .then(({ data }) => {
        console.log(data);
        setData(data.existingHomeBlockConfiguration);
        setImagePreview(data.existingHomeBlockConfiguration.media)
        setBase64ImageArr(data.existingHomeBlockConfiguration.media);
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
    getData()
  }, [])


  /* File upload and preview function */

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems.length > 0) {
      fileItems.forEach((fileItem) => {
        if (fileItem && fileItem.file instanceof Blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setBase64ImageArr(e.target.result);
            formik.setFieldValue("image", e.target.result);
          };
          reader.readAsDataURL(fileItem.file);
        } else {
          console.error("Invalid fileItem or fileItem.file is not a Blob");
        }
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
    subText: Yup.string()
      .required("Sub text is required")
      .test(
        "no-leading-trailing-spaces",
        "Sub text cannot start or end with white spaces",
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
    headerText: data ? data?.header_text : "",
    subText: data && data.sub_text ? data.sub_text : '',
    image: data ? data.media : "",
    buttons: [
      {
        name: "",
        url: "",
      },
    ],
    buttonUrl: "",
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
      const buttons = values.buttons?.map(button => ({
        button_name: button.name,
        button_url: button.url
      }));

      updateHomeBlock(
        accessToken,
        data.id,
        values.headerText,
        values.subText,
        base64ImageArr ? base64ImageArr : data.media,
        buttons,
        "left",
        data.status,
        "tipblock"
      )
        .then(({ data }) => {
          toast.success('Tip Block updated successfully', {
            theme: "dark",
          });
          setTimeout(()=>{
            let path = `/admin/configurations/tip`;
            navigate.push(path);
          }, 2500)
          dispatch(setSliderType("tip"))
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
        .finally(() => {
          setSubmitting(false);
          setLoading(false)
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
                Edit Block
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
                  <Col md={12}>
                    <FormGroup>
                      <Form.Label className="form-label text-dark">
                        Sub text
                      </Form.Label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter sub text"
                        name="subText"
                        value={formik.values.subText}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.subText &&
                        formik.touched.subText && (
                          <div className="text-danger">
                            {formik.errors.subText}
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
                      {/* {formik.touched.image && formik.errors.image && (
                        <div className="text-danger">
                          {formik.errors.image}
                        </div>
                      )} */}
                    </FormGroup>
                  </Col>
                  {/* Banner image upload end */}


                  {/* Text alignment end */}
                </Row>
                {/* Banner image, text alignment, add buttons end */}

                <div className="horizontal-row my-3"></div>

                {/* Preview, save as draft, publish buttons row start */}
                <Row>
                  {/* Save as draft button start */}
                  <Col lg={6} className="mt-3">
                    <div>
                      <Link href="/admin/configurations/tip">
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
                      <Button variant="primary" type="submit" id="submitButton" className={`btn btn-primary w-100 ${imgUploadError || loading ? 'disabled' : null}`}>

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
