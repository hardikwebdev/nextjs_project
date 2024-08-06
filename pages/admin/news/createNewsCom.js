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
  Modal,
} from "react-bootstrap";
import Link from "next/link";
import Select from "react-select";
import BlogPreview from "@/pages/admin/blogNewsPreview/blogPreview";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview,
  FilePondPluginFileValidateSize
);
import { useDispatch } from "react-redux"; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";
import { TagsInput } from "react-tag-input-component";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { EditorState } from "draft-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createBlog,
  getAuthors,
  getCategories,
} from "@/shared/services/Admin_Apis/blog-news/blogNewsCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import QuillEditor from "@/components/QuillEditor";

const CreateNewscom = () => {
  const [selectedTag, setSelectedTag] = React.useState([]); // Tag selection
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [contentType, setContentType] = useState("Free"); // Set the default content type to "Free"
  const [postType, setPostType] = useState("news");
  const [status, setStatus] = useState(1);
  const [drafted, setDrafted] = useState(0);
  const [base64ImageArr, setbase64ImageArr] = React.useState([]); // Initialize as an empty string
  const [filesImage, setFilesImage] = useState([]);
  const [imgUploadError, setImgUploadError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bannerType, setBannerType] = useState("Image");
  const [longDiscContent, setLongDiscContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dataForPreview, setDataForPreview] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch(); // Get the dispatch function
  const { mode, data } = router.query;
  const newsData = data ? JSON.parse(decodeURIComponent(data)) : null;
  const accessToken = useSelector((state) => state?.userData?.access_token);

  const handleBannerType = (type) => {
    setBannerType(type);
    setFilesImage();
  };
  useEffect(() => {
    if (filesImage?.length === 0) {
      setbase64ImageArr([]);
    }
  }, [filesImage]);
  useEffect(() => {
    setDataForPreview({
      ...dataForPreview,
      parsedBanner:
        base64ImageArr[0]?.startsWith("data:image") ||
        base64ImageArr[0]?.startsWith("data:video")
          ? base64ImageArr
          : null,
      category: selectedCategory,
      user: selectedAuthor,
      publish_date: selectedDate,
    });
  }, [
    selectedAuthor,
    selectedTag,
    selectedDate,
    selectedCategory,
    base64ImageArr,
  ]);

  useEffect(() => {
    setDataForPreview({ ...dataForPreview, long_description: longDiscContent });
  }, [longDiscContent]);

  const handleModal = () => {
    setShowModal(true);
  };

  const LoginSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .test(
        "no-leading-trailing-spaces",
        "Title cannot start or end with white spaces",
        (value) => {
          if (value) {
            const trimmedValue = value.trim();
            return trimmedValue === value; // Check if the input has leading/trailing white spaces
          }
          return true; // Allow empty input
        }
      ),
    shortDescription: Yup.string()
      .required("Short description is required")
      .test(
        "no-leading-trailing-spaces",
        "Short description cannot start or end with white spaces",
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
    title: "", // Check if title exists in newsData
    shortDescription: "", // Check if title exists in newsData
    LongDescription: EditorState.createEmpty(),
  };

  const handleFilePondUpdate = (fileItems) => {
    if (fileItems?.length > 0) {
      fileItems.forEach((fileItem) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setbase64ImageArr([e.target.result]);
        };
        reader.readAsDataURL(fileItem.file);
      });
    }
    setFilesImage(fileItems);
  };

  let navigate = useRouter();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      const selectedCategoryValue = selectedCategory
        ? selectedCategory.value
        : null; // Extract the value
      const selectedAuthorValue = selectedAuthor ? selectedAuthor.value : null; // Extract the value of the selected author
      setLoading(true);
      document.getElementById("submitButton").disabled = true;

      createBlog(
        accessToken,
        values.title,
        values.shortDescription,
        selectedCategoryValue,
        contentType,
        postType,
        selectedTag,
        base64ImageArr,
        selectedAuthorValue,
        status,
        drafted,
        selectedDate,
        longDiscContent
      )
        .then(({ data }) => {
          toast.success(data?.message, {
            theme: "dark",
          });
          let path = `/admin/news`;
          navigate.push(path);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message[0]
              ? error?.response?.data?.message[0]
              : error?.response?.data?.message,
            {
              theme: "dark",
            }
          );
        })
        .finally(() => {
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  return (
    <div>
      <>
        {/* News title start */}

        <Card className="mt-4">
          <Card.Body className="py-0">
            <div className="breadcrumb-header justify-content-between">
              <div className="left-content">
                <span className="main-content-title mg-b-0 mg-b-lg-1">
                  Create News
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* News title end */}

        <Form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            formik.handleSubmit(); // Trigger form submission
          }}
        >
          <Row>
            {/* News title, banner, short description, long description cols start */}
            <Col lg={8} md={8}>
              <Card className="shadow-search">
                <Card.Body>
                  <Row>
                    {/* News title start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          News title
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          placeholder="Enter news title"
                          type="text"
                          name="title"
                          value={formik.values.title}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setDataForPreview({
                              ...dataForPreview,
                              title: e.target.value,
                            });
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.title && formik.touched.title && (
                          <div className="text-danger">
                            {formik.errors.title}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    {/* News title end */}

                    {/* Banner start */}
                    <Col md={12}>
                      <FormGroup className="form-group">
                        <Form.Label className="form-label text-dark">
                          Banner
                        </Form.Label>
                        <div className="py-2 pb-3 px-4 border">
                          <div className="d-md-flex ad-post-details">
                            <>
                              <Form.Label className="custom-control custom-radio mb-2 me-4">
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  name="radio2"
                                  defaultevalue="option1"
                                  defaultChecked
                                  onClick={() => handleBannerType("Image")}
                                />
                                <span className="custom-control-label">
                                  Image
                                </span>
                              </Form.Label>
                              <Form.Label className="custom-control custom-radio  mb-2">
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  name="radio2"
                                  defaultevalue="option2"
                                  onClick={() => handleBannerType("Video")}
                                />
                                <span className="custom-control-label">
                                  Video
                                </span>
                              </Form.Label>
                            </>
                          </div>
                          {bannerType === "Image" ? (
                            <>
                              <FilePond
                                className="cursor-pointer"
                                files={filesImage}
                                allowReorder={true}
                                allowMultiple={false} // Adjust to your requirements
                                allowFileTypeValidation={true}
                                maxFileSize={10 * 1024 * 1024}
                                labelMaxFileSizeExceeded={"File is too large"}
                                acceptedFileTypes={[
                                  "image/png",
                                  "image/jpeg",
                                  "image/jpg",
                                ]} // Adjust to your desired file types
                                onupdatefiles={handleFilePondUpdate}
                                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                name="image"
                                onerror={(error) => {
                                  setImgUploadError(error);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <FilePond
                                className="cursor-pointer"
                                files={filesImage}
                                allowReorder={true}
                                allowMultiple={false} // Adjust to your requirements
                                allowFileTypeValidation={true}
                                acceptedFileTypes={["video/*"]}
                                onupdatefiles={handleFilePondUpdate}
                                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                name="image"
                                onerror={(error) => {
                                  setImgUploadError(error);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                    {/* Banner end */}

                    {/* Short description start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Short description
                        </Form.Label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Enter short description"
                          name="shortDescription"
                          value={formik.values.shortDescription}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setDataForPreview({
                              ...dataForPreview,
                              short_description: e.target.value,
                            });
                          }}
                          onBlur={formik.handleBlur}
                          maxLength={255}
                        />
                        <div className="text-muted">
                          Character Count:{" "}
                          {formik.values.shortDescription?.length} / 255
                        </div>
                        {formik.errors.shortDescription &&
                          formik.touched.shortDescription && (
                            <div className="text-danger">
                              {formik.errors.shortDescription}
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                    {/* Short description end */}

                    {/* Long description start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Long description
                        </Form.Label>
                        <div className="ql-wrapper border news-news-editor">
                          <QuillEditor
                            onContentChange={(data) => {
                              setLongDiscContent(data);
                            }}
                            longDiscContent={longDiscContent}
                          />
                          {/* {formik.touched.LongDescription && !formik.values.LongDescription.getCurrentContent().hasText() && (
                          <div className="text-danger">Long description is required.</div>
                        )} */}
                        </div>
                      </FormGroup>
                    </Col>
                    {/* Long description end */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {/* News title, banner image, short description, long description cols end */}

            {/* Publish date, category, author name, tags, content type, preview, save and publish buttons cols start */}
            <Col lg={4} md={4}>
              <Card className="right-bar-sticky shadow-search">
                <Card.Body>
                  {/* Publish date, category, author name, tags, content type row start */}
                  <Row>
                    {/* Publish date start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Publish date
                        </Form.Label>
                        <InputGroup className="input-group reactdate-pic">
                          <DatePicker
                            className="form-control"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    {/* Publish date end */}

                    {/* Category start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Category
                        </Form.Label>
                        <Select
                          classNamePrefix="selectform cursor-pointer"
                          options={categories} // Use the categories state to populate options
                          placeholder="Select category"
                          noOptionsMessage={() =>
                            "No matching categories found"
                          }
                          value={selectedCategory} // Set the selected category
                          onChange={(selectedCategory) => {
                            setSelectedCategory(selectedCategory);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    {/* Category end */}

                    {/* Author name start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Author name
                        </Form.Label>

                        <Select
                          classNamePrefix="selectform cursor-pointer"
                          options={authors}
                          placeholder="Select author"
                          noOptionsMessage={() => "No matching authors found"}
                          value={selectedAuthor} // Set the selected category
                          onChange={(selectedOption) => {
                            setSelectedAuthor(selectedOption); // Store the selected author's name
                          }}
                        />
                      </FormGroup>
                    </Col>
                    {/* Author name end */}

                    {/* Tags start */}
                    <Col lg={12} xl={12}>
                      <FormGroup>
                        <div className="d-flex">
                          <Form.Label className="form-label text-dark">
                            Tags
                          </Form.Label>
                        </div>
                        <div className="text-wrap">
                          <div className="form-group">
                            <TagsInput
                              className="badge"
                              value={selectedTag}
                              onChange={(value) => {
                                const filteredTags = value.filter(
                                  (tag) => tag.trim() !== ""
                                );
                                setSelectedTag(filteredTags);
                                // setSelectedTag(value)
                              }}
                              name="Tags"
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                    {/* Tags end */}

                    {/* Content type start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Content type
                        </Form.Label>
                        <label className="switch switch-flat">
                          {/* {contentType === "paid" ? (
                            <input
                              className="switch-input"
                              type="checkbox"
                              onChange={(e) =>
                                setContentType(
                                  e.target.checked ? "paid" : "free"
                                )
                              } // Toggle between "Paid" and "Free"
                              defaultChecked
                            />
                          ) : (
                            <input
                              className="switch-input"
                              type="checkbox"
                              onChange={(e) =>
                                setContentType(
                                  e.target.checked ? "paid" : "free"
                                )
                              } // Toggle between "Paid" and "Free"
                            />
                          )} */}

                          {contentType === "paid" ? (
                            <input
                              className="switch-input"
                              type="checkbox"
                              defaultChecked // Initialize based on content_type
                              onClick={(e) =>
                                handleType(e.target.checked ? "paid" : "free")
                              }
                              // onChange={(e) =>
                              //   setContentType(
                              //     e.target.checked ? "paid" : "free"
                              //   )
                              // } // Toggle between "Paid" and "Free"
                            />
                          ) : (
                            <input
                              className="switch-input"
                              type="checkbox"
                              onClick={(e) =>
                                handleType(e.target.checked ? "paid" : "free")
                              }
                            />
                          )}

                          <span
                            className="switch-label"
                            data-on="Paid"
                            data-off="Free"
                          ></span>
                          <span className="switch-handle"></span>
                        </label>
                      </FormGroup>
                    </Col>
                    {/* Content type end */}
                  </Row>
                  {/* Publish date, category, author name, tags, content type row end */}

                  <div className="horizontal-row my-3"></div>

                  {/* Preview, save as draft, publish buttons row start */}
                  <Row>
                    {/* Preview button start */}
                    <Col lg={12}>
                      <div className="d-flex align-items-center justify-content-end">
                        <span
                          className="text-info d-flex align-items-center cursor-pointer"
                          onClick={handleModal}
                        >
                          <i className="fe fe-eye me-1"></i>
                          <span>Preview</span>
                        </span>
                      </div>
                    </Col>
                    {/* Preview button end */}

                    {/* Save as draft button start */}
                    <Col lg={6} className="mt-3">
                      <div>
                        <Link href="/admin/news">
                          <button className="btn btn-danger w-100">
                            Cancel
                          </button>
                        </Link>
                      </div>
                    </Col>
                    {/* Save as draft button end */}

                    {/* Publish button start */}
                    <Col lg={6} className="mt-3">
                      <div>
                        <Button
                          variant=""
                          type="submit"
                          id="submitButton"
                          className={`btn btn-primary w-100 ${
                            imgUploadError ? "disabled" : null
                          }`}
                        >
                          {loading ? (
                            <Spinner
                              animation="border"
                              className="spinner-border spinner-border-sm ms-3"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </Spinner>
                          ) : (
                            "Publish now"
                          )}
                        </Button>
                        {/* <Button
                          className="btn btn-primary w-100"
                          type="submit"
                        >
                          Publish now
                        </Button> */}
                      </div>
                    </Col>
                    {/* Publish button end */}
                  </Row>
                  {/* Preview, save as draft, publish buttons row start */}
                </Card.Body>
              </Card>
            </Col>

            {/* Publish date, category, author name, tags, content type, preview, save and publish buttons cols start */}
          </Row>
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="fullscreen"
            className="previewModalFulll"
          >
            <Modal.Header>
              <Modal.Title>Preview</Modal.Title>
              <Button
                variant=""
                className="btn btn-close p-0 me-1"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                x
              </Button>
            </Modal.Header>
            <Modal.Body>
              <>
                <BlogPreview data={dataForPreview} />
              </>
            </Modal.Body>
          </Modal>
        </Form>
      </>
      <ToastContainer />
    </div>
  );
};

export default CreateNewscom;
