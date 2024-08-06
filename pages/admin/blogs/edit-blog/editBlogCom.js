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
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import filepondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImageExifOrientation, FilePondPluginImagePreview, filepondPluginMediaPreview, FilePondPluginFileValidateSize)
import { TagsInput } from "react-tag-input-component";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import QuillEditor from "@/components/QuillEditor";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateBlog, getAuthors, getCategories } from "@/shared/services/Admin_Apis/blog-news/blogNewsCrud";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData } from "@/shared/redux/actions/authAction";
import BlogPreview from '@/pages/admin/blogNewsPreview/blogPreview'

const EditBlogcom = () => {
  const [selectedTag, setSelectedTag] = React.useState([]); // Tag selection
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [contentType, setContentType] = useState("Free"); // Set the default content type to "Free"
  const [postType, setPostType] = useState("blog");
  const [drafted, setDrafted] = useState(0);
  const [base64ImageArr, setbase64ImageArr] = React.useState([]); // Initialize as an empty string
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imagePreview, setImagePreview] = useState([]);
  const [removedImages, setRemovedImages] = React.useState([]); // To keep track of removed images
  const [bannerType, setBannerType] = useState("Image");
  const [longDiscContent, setLongDiscContent] = useState("");
  const [filesImage, setFilesImage] = useState([]);
  const [imgUploadError, setImgUploadError] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataForPreview, setDataForPreview] = useState([]);
  const [parsedBanner, setParsedBanner] = useState([]);

  useEffect(() => {
    if (filesImage?.length <= 0) {
      setbase64ImageArr([])
    }
    if (filesImage?.length === 0) {
      setImgUploadError("")
    }
  }, [filesImage])

  const dispatch = useDispatch();
  const blogData = useSelector((state) => state?.blogNewsData);
  let navigate = useRouter();
  const accessToken = useSelector((state) => state?.userData?.access_token);

  const handleType = (type) => {
    setContentType(type)
  }

  const handleBannerType = (type) => {
    console.log("type");
    setBannerType(type);
    setFilesImage([]);
  }
  useEffect(() => {
    if (imagePreview?.length === 0) {
      setbase64ImageArr([])
    }
  }, [imagePreview])

  useEffect(() => {
    setDataForPreview({ ...dataForPreview, parsedBanner: base64ImageArr[0]?.startsWith("data:image") || base64ImageArr[0]?.startsWith("data:video") ? base64ImageArr : base64ImageArr?.length === 0 ? imagePreview : parsedBanner, category: selectedCategory, user: selectedAuthor })
  }, [blogData, selectedAuthor, selectedTag, selectedDate, selectedCategory, base64ImageArr, filesImage]);
  useEffect(() => {
    setDataForPreview({ ...dataForPreview, long_description: longDiscContent })
  }, [longDiscContent])

  const handleModal = () => {
    setShowModal(true);
  };



  const handleRemoveImage = (imgSrc) => {
    setRemovedImages((prevRemovedImages) => [...prevRemovedImages, imgSrc]);

    const updatedImagePreview = imagePreview.filter((image) => image.Location !== imgSrc);
    const indexToRemove = imagePreview.findIndex((image) => image.Location === imgSrc);

    if (indexToRemove !== -1) {
      setImagePreview(updatedImagePreview);

      // Check if the removed image has a video thumbnail and add it to the remove array
      const videoThumbnailLocation = imagePreview[indexToRemove]?.video_thumbnail?.Location;
      if (videoThumbnailLocation) {
        setRemovedImages((prevRemovedImages) => [...prevRemovedImages, videoThumbnailLocation]);
      }
    }
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
            return trimmedValue === value;
          }
          return true;
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
            return trimmedValue === value;
          }
          return true;
        }
      ),
  });

  const initialValues = {
    title: blogData && blogData.title ? blogData.title : "",
    shortDescription:
      blogData && blogData.short_description ? blogData.short_description : "",
    LongDescription: blogData && blogData.long_description
      ? blogData.long_description
      : '',
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


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      const selectedCategoryValue = selectedCategory
        ? selectedCategory.value
        : null;
      const selectedAuthorValue = selectedAuthor ? selectedAuthor.value : null;

      const removedImagesData = imagePreview.map((image) => image.Location);
      const remove = [];
      if (filesImage?.length > 0) {
        const removedImagePreviews = filesImage.map((fileItem) => fileItem.serverId);
        setRemovedImages(removedImagesData.concat(removedImagePreviews));
        const removeData = removedImagesData.concat(removedImagePreviews).filter(item => item !== null);
        remove.push.apply(remove, removeData);

        // Check if a new video is selected
        const isVideoSelected = filesImage.some((fileItem) => fileItem.file.type.startsWith("video"));

        if (isVideoSelected) {
          // Add the video thumbnail URL to the remove array
          const videoThumbnailLocation = imagePreview[0]?.video_thumbnail?.Location;
          if (videoThumbnailLocation) {
            remove.push(videoThumbnailLocation);
          }
        }
      }

      setLoading(true);
      document.getElementById("submitButton").disabled = true;

      updateBlog(
        accessToken,
        blogData.id,
        values.title,
        selectedAuthorValue,
        base64ImageArr,
        selectedCategoryValue,
        contentType,
        longDiscContent,
        blogData.parent_id,
        postType,
        values.shortDescription,
        drafted,
        blogData.status,
        selectedTag,
        selectedDate,
        removedImages?.length > 0 ? removedImages : remove,
      )
        .then(({ data }) => {
          toast.success(data?.message, {
            theme: "dark",
          });
          setTimeout(() => {
            let path = `/admin/blogs`;
            navigate.push(path);
          }, 1000)
        })
        .catch((error) => {
          toast.error(error?.response?.data?.description, {
            theme: "dark",
          });
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
        {/* Blog title start */}

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
        {/* Blog title end */}

        <Form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            formik.handleSubmit(); // Trigger form submission
          }}
        >
          <Row>
            {/* Blog title, banner, short description, long description cols start */}
            <Col lg={8} md={8}>
              <Card className="shadow-search">
                <Card.Body>
                  <Row>
                    {/* Blog title start */}
                    <Col md={12}>
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Blog title
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          placeholder="Enter blog title"
                          type="text"
                          name="title"
                          value={formik.values.title}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setDataForPreview({ ...dataForPreview, title: e.target.value });
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
                    {/* Blog title end */}

                    {/* Banner start */}
                    <Col md={12}>
                      <FormGroup className=" form-group">
                        <Form.Label className="form-label text-dark">
                          Banner
                        </Form.Label>
                        <div className="py-2 pb-3 px-4 border">
                          <div className="d-md-flex ad-post-details">
                            {blogData?.parsedBanner[0]?.type === "blog_video" ? (
                              <>
                                <Form.Label className="custom-control custom-radio mb-2 me-4">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    name="radio2"
                                    defaultevalue="option1"

                                    onChange={() => handleBannerType("Image")}
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
                                    defaultChecked
                                    onChange={() => handleBannerType("Video")}
                                  />
                                  <span className="custom-control-label">
                                    Video
                                  </span>
                                </Form.Label>
                              </>
                            ) : (
                              <>
                                <Form.Label className="custom-control custom-radio mb-2 me-4">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    name="radio2"
                                    defaultevalue="option1"
                                    defaultChecked
                                    onChange={() => handleBannerType("Image")}
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

                                    onChange={() => handleBannerType("Video")}
                                  />
                                  <span className="custom-control-label">
                                    Video
                                  </span>
                                </Form.Label>
                              </>
                            )}
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
                                labelMaxFileSizeExceeded={'File is too large'}
                                acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']} // Adjust to your desired file types
                                onupdatefiles={handleFilePondUpdate}
                                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                name="image"
                                onerror={(error) => {
                                  setImgUploadError(error)
                                }}
                              />

                            </>
                          ) : (
                            <>
                              <FilePond
                                files={filesImage}

                                className="cursor-pointer"
                                allowReorder={true}
                                allowMultiple={false} // Allow multiple file uploads
                                allowFileTypeValidation={true}
                                acceptedFileTypes={['video/*']}
                                onerror={(error) => {
                                  setImgUploadError(error)
                                }}
                                onupdatefiles={(fileItems) => {
                                  if (fileItems?.length > 0) {
                                    const base64Images = [];
                                    fileItems.forEach((fileItem) => {
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        base64Images.push(e.target.result);
                                      };
                                      reader.readAsDataURL(fileItem.file);
                                    }),
                                      setbase64ImageArr(base64Images);
                                  }
                                }}
                                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                              />
                            </>
                          )}


                          {imagePreview?.length > 0 ? (
                            <Row className="text-center">

                              {imagePreview?.map((image, index) => (
                                <>
                                  {image.type === "blog_image" ? (

                                    <Col md={6} xxl={4} key={index}>
                                      <div className="d-flex flex-column m-3">
                                        <img
                                          key={index}
                                          src={image.Location}
                                          alt={`Image ${index + 1}`}
                                          className="preview-image h-100"
                                        />
                                        <button
                                          className="bg-danger text-white border-none"
                                          type="button"
                                          onClick={() =>
                                            handleRemoveImage(image.Location)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </Col>
                                  ) :
                                    (
                                      <Col md={6} xxl={4} key={index}>
                                        <div className="d-flex flex-column m-3">
                                          <video controls width="100%">
                                            <source src={image.Location} type="video/mp4" />
                                            Your browser does not support the video tag.
                                          </video>
                                          <button
                                            className="bg-danger text-white border-none"
                                            type="button"
                                            onClick={() =>
                                              handleRemoveImage(image.Location)
                                            }
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </Col>
                                    )
                                  }
                                </>
                              ))}
                            </Row>
                          ) : null}

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
                          className={`form-control`}
                          rows={3}
                          placeholder="Enter short description"
                          name="shortDescription"
                          value={formik.values.shortDescription}
                          // onChange={formik.handleChange}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setDataForPreview({ ...dataForPreview, short_description: e.target.value });
                          }}
                          onBlur={formik.handleBlur}
                          maxLength={255}
                        />
                        <div className="text-muted">
                          Character Count: {formik.values.shortDescription?.length} / 255
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
                    <Col md={12} className="mt-2">
                      <FormGroup>
                        <Form.Label className="form-label text-dark">
                          Long description
                        </Form.Label>
                        <div className="ql-wrapper border blog-news-editor">
                          <QuillEditor onContentChange={(data) => {
                            setLongDiscContent(data);
                          }} longDiscContent={longDiscContent} />
                        </div>
                      </FormGroup>
                    </Col>
                    {/* Long description end */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {/* Blog title, banner image, short description, long description cols end */}

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
                          options={categories}
                          placeholder="Select category"
                          noOptionsMessage={() => "No matching categories found"}
                          value={selectedCategory}
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
                          value={selectedAuthor}
                          onChange={(selectedOption) => {
                            setSelectedAuthor(selectedOption);
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
                              value={selectedTag?.map(tag => tag)}
                              onChange={(value) => {
                                const filteredTags = value.filter(tag => tag.trim() !== '');
                                setSelectedTag(filteredTags);
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
                          {contentType === "paid" ? (
                            <input
                              className="switch-input"
                              type="checkbox"
                              defaultChecked // Initialize based on content_type
                              onClick={(e) => handleType(e.target.checked ? "paid" : "free")}

                            />

                          ) : (
                            <input
                              className="switch-input"
                              type="checkbox"
                              onClick={(e) => handleType(e.target.checked ? "paid" : "free")}
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
                        <Link href="/admin/blogs">
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
                        <Button variant="" type="submit" id="submitButton" className={`btn btn-primary w-100 ${imgUploadError ? 'disabled' : null}`}>

                          {loading ?
                            <Spinner animation="border"
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </Spinner>
                            : "Publish now"}
                        </Button>

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
          <Modal show={showModal} onHide={() => setShowModal(false)} size="fullscreen" className="previewModalFulll">
            <Modal.Header>
              <Modal.Title>
                Preview
              </Modal.Title>
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

export default EditBlogcom;
