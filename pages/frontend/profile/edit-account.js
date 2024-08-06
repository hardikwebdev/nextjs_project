import React, { useState, useEffect, useRef } from 'react';
import { Spinner, Button, Col, Form, Row, Container, Alert } from "react-bootstrap";
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import { getProfile, updateProfile } from '@/shared/services/Front_Apis/account/accountCrud';
import edit_pen from '../../../public/assets/img/front/edit_pen.png';
import { useRouter } from 'next/router';
import Header from '../header.js';
import Footer from '../footer.js';
import Seo from "@/shared/layout-components/seo/seo";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)
import { getGeneralConfig } from "@/shared/services/Front_Apis/homePage/homePageCrud";
import { setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook

const EditProfilePage = () => {
    const edit_icon = edit_pen.src;
    const [editProfile, setEditProfile] = useState();
    const [apiResponse, setApiResponse] = useState("success");
    const [base64ImageArr, setBase64ImageArr] = useState("");
    const [filesImage, setFilesImage] = useState([]); // to upload image
    const [loading, setLoading] = useState(false);
    const [imgUploadError, setImgUploadError] = useState("")
    const [data, setData] = useState("");
    const [generalConfigData, setGeneralConfigData] = useState();
    const [defaultAddress, setDefaultAddress] = useState('');

    const accessToken = useSelector((state) => state?.frontEndUserData?.access_token);
    const primaryThemeColor = generalConfigData?.primary_theme_color;
    const secondaryThemeColor = generalConfigData?.secondary_theme_color;
    const primaryButtonsColor = generalConfigData?.primary_button_color;
    const secondaryButtonsColor = generalConfigData?.secondary_button_color
    const fontColor = generalConfigData?.font_color;
    const dispatch = useDispatch(); // Get the dispatch function
    const filePondRef = useRef(null);
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    let navigate = useRouter();

    const getGeneralConfigData = () => {
        getGeneralConfig()
            .then(({ data }) => {
                setGeneralConfigData(data)
                dispatch(setGeneralConfigs(data));
            })
            .catch((error) => {
                console.log(error);

            })
    }

  
useEffect(() => {
  // Use the Geolocation API to get the current user's position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
          );
          const data = await response.json();
          const formattedAddress = data.results[0].formatted_address;
          setDefaultAddress(formattedAddress);
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      },
      (error) => {
        console.error('Error getting current location:', error.message);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}, []);


    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          .primaryThemeColor {
              background-color: ${primaryThemeColor};
              
            }
            .secondaryThemeColor{
              background-color: ${secondaryThemeColor};
            }
            .secondaryButtonColor{
              background-color: ${secondaryButtonsColor};
            }
            .primaryButtonColor{
              background-color: ${primaryButtonsColor};
            }
            .FontColor{
                color: ${fontColor};
              }
              .personal_profile_list li.active{
                list-style-type: none;
    border-bottom: 1px solid ${fontColor} !important;
          `;
        document.head.appendChild(style);

        if (generalConfigData?.blog_toggle === 0) {
            let path = `/`;
            navigate.push(path);
        }
    }, [generalConfigData]);

    useEffect(() => {
        getGeneralConfigData();
    }, [])


    useEffect(() => {
        if (filesImage?.length === 0) {
            setImgUploadError("")
        }
    }, [filesImage])

    const closeErrorMsg = () => {
        if (imgUploadError) {
            setImgUploadError("");
            setFilesImage([])
        }
    }

    const handleEditIconClick = () => {
        if (filePondRef.current) {
            filePondRef.current.getFiles(); // Clear existing files (optional)
            filePondRef.current.browse(); // Open file dialog
        }
    };

    const initialValues = {

        email: data ? data?.email : '',
        first_name: data ? data?.first_name : '',
        last_name: data ? data?.last_name : '',
        account_bio: data ? data?.bio : '',
        address: data ? data?.address : '',
    };

    useEffect(() => {
        formik.setValues(initialValues);
        setBase64ImageArr(data?.profile_url)
    }, [data]);

    const editProfileSchema = Yup.object().shape({

        first_name: Yup.string()
            .required("First Name is required")
            .test(
                "no-leading-trailing-spaces",
                "Name cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        last_name: Yup.string()
            .required("Last Name is required")
            .test(
                "no-leading-trailing-spaces",
                "Name cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
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
        // address: Yup.string()
        //     .required("Address is required")
        //     .test(
        //         "no-leading-trailing-spaces",
        //         "Address cannot start or end with white spaces",
        //         (value) => {
        //             if (value) {
        //                 // Trim white spaces from the input
        //                 const trimmedValue = value.trim();
        //                 return trimmedValue === value; // Check if the input has leading/trailing white spaces
        //             }
        //             return true; // Allow empty input
        //         }
        //     ),
        account_bio: Yup.string()
            .required("Bio is required")
            .test(
                "no-leading-trailing-spaces",
                "Bio cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
    });

    const profileData = () => {
        getProfile(accessToken)
            .then(({ data }) => {
                setData(data.userProfileData);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        profileData();
    }, [])

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
        } else {
            setBase64ImageArr();
            formik.setFieldValue("image", ""); // Update the Formik form values
        }
        setFilesImage(fileItems);

    };

    const formik = useFormik({
        initialValues,
        validationSchema: editProfileSchema,
        onSubmit: (values, { setSubmitting }) => {
            console.log("true");
            setLoading(true);
            document.getElementById("submitButton").disabled = true;
            updateProfile(accessToken, values.first_name, values.last_name, values.address, values.account_bio, values.email, base64ImageArr)
                .then(({ data }) => {
                    setApiResponse("success")
                    // setTimeout(() =>{
                    setEditProfile(true)
                    setTimeout(() => {
                        let path = `/profile`;
                        navigate.push(path);
                    }, 2500);

                    // }, 1000)
                })
                .catch((error) => {
                    setApiResponse("error")
                    // setTimeout(() =>{
                    setEditProfile(true)
                    // }, 1000)
                })
                .finally(() => {
                    setTimeout(() => {
                        setEditProfile(false)
                    }, 3500);
                    setSubmitting(false);
                    setLoading(false);
                })


        },
    });


    return (
        <React.Fragment>
            <Seo title={"Edit Profile"} />

            <div className='tan-block'>
                <Header />
                <div className='personal_profile text-center background-color-1 py-4'>
                    <h2 className='tx-36 tx-sm-42 text-white py-3'>
                        Edit my account
                    </h2>
                </div>
                <div className='primaryThemeColor'>
                    <div className='py-5'>

                        <Container>
                            <Row>
                                <Col sm={12} md={12} lg={3}>
                                    <ul className='personal_profile_list p-0'>
                                        <li className='tx-17 FontColor py-2 mb-2 active'>
                                            <Link href="/profile" className='FontColor'>My personal profile</Link>

                                        </li>
                                        <li className='tx-17 text-color-3 py-2 mb-2'>
                                            <Link href="/profile/video-articles" className='text-color-3'>Saved videos and articles</Link>
                                        </li>
                                        <li className='tx-17 text-color-3 py-2'>
                                            <Link href="/profile/subscription-plan" className='text-color-3'>My subscription plan</Link>
                                        </li>
                                    </ul>
                                </Col>
                                <Col sm={12} md={12} lg={9}>
                                    <Row>
                                        <Col sm={12} md={12} lg={7}>
                                            <div>
                                                <Row className='collaborate_form mt-3'>
                                                    <Col sm={12} md={12} lg={12}>
                                                        <Form onSubmit={formik.handleSubmit}>
                                                            <Row>
                                                                <Col sm={12} md={12} lg={12} className='mb-4' >
                                                                    <div className='edit_profile profile_label_front'>
                                                                        <div className='edit_upload_main'>
                                                                            <FilePond
                                                                                ref={filePondRef}
                                                                                files={filesImage}
                                                                                labelIdle={data?.profile_url ? `<img src=${data?.profile_url} class="w-100 h-100" />` : `<img src="../../../assets/img/avatar.png" class="h-100 w-100"/>`}
                                                                                imagePreviewHeight={170}
                                                                                imageCropAspectRatio="1:1"
                                                                                imageResizeTargetWidth={200}
                                                                                imageResizeTargetHeight={200}
                                                                                stylePanelLayout="compact circle"
                                                                                styleLoadIndicatorPosition="center bottom"
                                                                                styleButtonRemoveItemPosition="center bottom"
                                                                                allowReorder={true}
                                                                                allowMultiple={false} // Allow multiple file uploads
                                                                                allowFileTypeValidation={true}
                                                                                acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                                                                onupdatefiles={handleFilePondUpdate}
                                                                                maxFileSize={10 * 1024 * 1024}
                                                                                labelMaxFileSizeExceeded={'File is too large'}
                                                                                onerror={(error) => {
                                                                                    setImgUploadError(error)
                                                                                }} />
                                                                            {!imgUploadError ?
                                                                                <div className='profile_edit_img m-0' >
                                                                                    <img src={edit_icon} alt='edit icon' className='cursor-pointer' onClick={handleEditIconClick}></img>
                                                                                </div>
                                                                                : null}
                                                                            {filesImage?.length > 0 && imgUploadError ?

                                                                                <p className="filepond--error m-0 position-relative my-3">
                                                                                    {imgUploadError.main}
                                                                                    <span className="position-absolute cursor-pointer" onClick={closeErrorMsg}><i className="fa fa-times-circle" aria-hidden="true"></i></span>
                                                                                </p>
                                                                                : null}
                                                                        </div>




                                                                    </div>
                                                                </Col>


                                                                <Col sm={12} md={12} lg={6} className='mb-3 mb-lg-0 pe-lg-2'>
                                                                    <Form.Control
                                                                        className="form-control"
                                                                        placeholder="First Name"
                                                                        type="text"
                                                                        name="first_name"
                                                                        value={formik.values.first_name}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.touched.first_name && formik.errors.first_name && (
                                                                        <div className="text-danger">{formik.errors.first_name}</div>
                                                                    )}
                                                                </Col>

                                                                <Col sm={12} md={12} lg={6} className='ps-lg-2'>
                                                                    <Form.Control
                                                                        className="form-control"
                                                                        placeholder="Last Name"
                                                                        type="text"
                                                                        name="last_name"
                                                                        value={formik.values.last_name}
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.touched.last_name && formik.errors.last_name && (
                                                                        <div className="text-danger">{formik.errors.last_name}</div>
                                                                    )}
                                                                </Col>
                                                                <Col sm={12} md={12} lg={12} className="mt-3">
                                                                    <Form.Group className="form-group">
                                                                        <Form.Control
                                                                            className="form-control"
                                                                            placeholder="Email"
                                                                            type="text"
                                                                            name="email"
                                                                            value={formik.values.email}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            disabled
                                                                        />
                                                                        {formik.errors.email && formik.touched.email && (
                                                                            <div className="text-danger">{formik.errors.email}</div>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col sm={12} md={12} lg={12} className="">
                                                                    <Form.Group className="form-group">
                                                                        <Form.Control
                                                                            className="form-control"
                                                                            placeholder="Address"
                                                                            type="text"
                                                                            name="address"
                                                                            value={formik.values.address}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                        />
                                                                        {formik.errors.email && formik.touched.address && (
                                                                            <div className="text-danger">{formik.errors.address}</div>
                                                                        )}

                                                                        {/* <div className='manually_address '>
                                                                            <Link href="#" className='FontColor tx-17'>
                                                                                Manually enter address
                                                                            </Link>
                                                                        </div> */}
                                                                    </Form.Group>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col sm={12} md={12} lg={12}>
                                                                    <div className="form-floating profile_update_bio">
                                                                        <textarea className="form-control p-2" placeholder="Bio" id="floatingTextarea" name="account_bio"
                                                                            value={formik.values.account_bio}
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur} />
                                                                        {formik.errors.account_bio && formik.touched.account_bio && (
                                                                            <div className="text-danger">{formik.errors.account_bio}</div>
                                                                        )}
                                                                        <label for="floatingTextarea"></label>
                                                                    </div>

                                                                    <div>
                                                                        <p className='tx-17 my-3 tx-normal text-danger required_text'>*All fields are required</p>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Button variant="" type="submit" id="submitButton" className={`tx-18 ${imgUploadError ? 'disabled' : null} FontColor primaryButtonColor`} >

                                                                {loading ?
                                                                    <Spinner animation="border"
                                                                        className="spinner-border spinner-border-sm ms-3"
                                                                        role="status"
                                                                    >
                                                                        <span className="sr-only">Loading...</span>
                                                                    </Spinner>
                                                                    : "Save Details"}
                                                            </Button>
                                                        </Form>

                                                        {editProfile ?
                                                            <>
                                                                {apiResponse === "success" ?
                                                                    <Alert
                                                                        className={`alert mb-2 alert-success mt-3`}
                                                                        variant=""
                                                                    >
                                                                        <Alert.Heading className='mb-0'>
                                                                            <h6 className="alert-heading mb-0">
                                                                                <i className="fa fa-check-circle me-2 tx-16"></i>
                                                                                Profile update Successfully
                                                                            </h6>
                                                                        </Alert.Heading>
                                                                    </Alert>
                                                                    : <Alert
                                                                        className={`alert mb-2 alert-danger mt-3`}
                                                                        variant=""
                                                                    >
                                                                        <Alert.Heading className='mb-0'>
                                                                            <h6 className="alert-heading mb-0">
                                                                                <i className="fa fa-check-circle me-2 tx-16"></i>
                                                                                Profile update Error
                                                                            </h6>
                                                                        </Alert.Heading>
                                                                    </Alert>
                                                                }
                                                            </>
                                                            :
                                                            null
                                                        }
                                                    </Col>
                                                </Row>

                                            </div>
                                        </Col>
                                    </Row>


                                </Col>
                            </Row>
                        </Container>

                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    )
}


export default EditProfilePage;