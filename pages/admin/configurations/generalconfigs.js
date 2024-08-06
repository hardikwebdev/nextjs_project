import React, { useState, useEffect } from 'react';
import { Card, Col, Form, FormGroup, Row, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import Seo from '@/shared/layout-components/seo/seo';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)
import { updateGeneralConfigs, getGeneralConfigs } from '@/shared/services/Admin_Apis/genralConfigs/genralConfigsCrud';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux'; // Import the useDispatch hook
import { setUserData, setGeneralConfigs } from "@/shared/redux/actions/authAction";
import { NULL } from 'sass';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const generalConfigs = () => {
    const [filesimage, setFilesImage] = useState([]); // to upload image    
    const [filesimageFront, setFilesImageFront] = useState([]); // to upload image
    const [filesimageForSqurelogo, setFilesImageForSqurelogo] = useState([]); // to upload image
    const [checkImage, setCheckImage] = useState(null); // to show image preview
    const [checkFrontImage, setCheckFrontImage] = useState(null); // to show image preview
    const [checkSquareImage, setCheckSquareImage] = useState(null); // to show image preview
    const [isEditModeFontColor, setIsEditModeFontColor] = useState(false);
    const [isEditModeHeaderFooterBgColor, setIsEditModeHeaderFooterBgColor] = useState(false);
    const [isEditModeHeaderFooterFontColor, setIsEditModeHeaderFooterFontColor] = useState(false);
    const [isEditModePrimaryThemeColor, setIsEditModePrimaryThemeColor] = useState(false);
    const [isEditModeSecondaryThemeColor, setIsEditModeSecondaryThemeColor] = useState(false);
    const [isEditModePrimaryButtonColor, setIsEditModePrimaryButtonColor] = useState(false);
    const [isEditModeSecondaryButtonColor, setIsEditModeSecondaryButtonColor] = useState(false);
    const [isEditModeSiteName, setIsEditModeSiteName] = useState(false);
    const [isEditModefacebookName, setIsEditModefacebookName] = useState(false);
    const [isEditModeinstagramName, setIsEditModeinstagramName] = useState(false);
    const [isEditModetwitterName, setIsEditModetwitterName] = useState(false);
    const [isEditModeImage, setIsEditModeImage] = useState(false);
    const [isEditModeFrontImage, setIsEditModeFrontImage] = useState(false);
    const [isEditModeSquareImg, setIsEditModeSquareImg] = useState(false);
    const [configs, setConfigs] = useState([])
    const [siteName, setSiteName] = useState("")
    const [facebookName, setFacebookName] = useState("")
    const [instagramName, setInstagramName] = useState("")
    const [twitterName, setTwitterName] = useState("")
    const [fontColor, setFontColor] = useState("")
    const [headerFooterFontColor, setHeaderFooterFontColor] = useState("")
    const [headerFooterBgColor, setHeaderFooterBgColor] = useState("")
    const [primaryThemeColor, setPrimaryThemeColor] = useState("")
    const [secondaryThemeColor, setSecondaryThemeColor] = useState("")
    const [primaryButtonColor, setPrimaryButtonColor] = useState("")
    const [secondaryButtonColor, setSecondaryButtonColor] = useState("")
    const [siteLogo, setSiteLogo] = useState(null);
    const [siteLogoFront, setSiteLogoFront] = useState(null);
    const [siteSquareLogo, setSiteSquareLogo] = useState(null);
    const [base64ImageArr, setBase64ImageArr] = useState("");
    const [base64ImageArrFront, setBase64ImageArrFront] = useState("");
    const [base64ImageArrForSquare, setBase64ImageArrForSquare] = useState("");
    const [imgUploadError, setImgUploadError] = useState("")
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    let navigate = useRouter();


    useEffect(() => {
        if (filesimage?.length === 0) {
            setImgUploadError("")
        }
    }, [filesimage])


    const getData = () => {
        getGeneralConfigs(accessToken)
            .then(({ data }) => {
                console.log("mydata", data)
                setConfigs(data);
                setFontColor(data.font_color);
                setHeaderFooterBgColor(data?.header_footer_bg_color)
                setHeaderFooterFontColor(data?.header_footer_font_color)
                setPrimaryThemeColor(data.primary_theme_color);
                setSecondaryThemeColor(data.secondary_theme_color);
                setPrimaryButtonColor(data.primary_button_color);
                setSecondaryButtonColor(data.secondary_button_color)
                setSiteName(data.site_name)
                setSiteLogo(data.site_logo)
                setSiteLogoFront(data.site_front_logo)
                setSiteSquareLogo(data.site_square_logo)
                setFacebookName(data.media_config_parsed.facebook_link)
                setInstagramName(data.media_config_parsed.instagram_link)
                setTwitterName(data.media_config_parsed.twitter_link)
                dispatch(setGeneralConfigs(data));
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
        getData();
    }, []);

    useEffect(() => {
        if (base64ImageArr?.length > 0) {
            setSiteLogo(base64ImageArr)
        }
    }, [base64ImageArr])
    useEffect(() => {
        if (base64ImageArrFront?.length > 0) {
            setSiteLogoFront(base64ImageArrFront)
        }
    }, [base64ImageArrFront])
    useEffect(() => {
        if (base64ImageArrForSquare?.length > 0) {
            setSiteSquareLogo(base64ImageArrForSquare)
        }
    }, [base64ImageArrForSquare])

    const handleTip = () => {
        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        updateGeneralConfigs(
            accessToken,
            configs?.id,
            configs?.tip_toggle === 1 ? 0 : 1,
            configs?.blog_toggle,
            configs?.comments_toggle,
            configs?.news_toggle,
            siteLogo,
            fontColor,
            primaryThemeColor,
            secondaryThemeColor,
            primaryButtonColor,
            secondaryButtonColor,
            siteName,
            siteSquareLogo,
            siteLogoFront,
            mediaConfig,
            headerFooterBgColor,
            headerFooterFontColor,
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
                getData();
            });
    }


    const handleBlog = () => {
        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        updateGeneralConfigs(
            accessToken,
            configs?.id,
            configs?.tip_toggle,
            configs?.blog_toggle === 1 ? 0 : 1,
            configs?.comments_toggle,
            configs?.news_toggle,
            siteLogo,
            fontColor,
            primaryThemeColor,
            secondaryThemeColor,
            primaryButtonColor,
            secondaryButtonColor,
            siteName,
            siteSquareLogo,
            siteLogoFront,
            mediaConfig,
            headerFooterBgColor,
            headerFooterFontColor,
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
                getData();
            });
    }
    const handleNews = () => {
        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        updateGeneralConfigs(
            accessToken,
            configs?.id,
            configs?.tip_toggle,
            configs?.blog_toggle,
            configs?.comments_toggle,
            configs?.news_toggle === 1 ? 0 : 1,
            siteLogo,
            fontColor,
            primaryThemeColor,
            secondaryThemeColor,
            primaryButtonColor,
            secondaryButtonColor,
            siteName,
            siteSquareLogo,
            siteLogoFront,
            mediaConfig,
            headerFooterBgColor,
            headerFooterFontColor
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
                getData();
            });
    }
    const handleComments = () => {
        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        updateGeneralConfigs(
            accessToken,
            configs?.id,
            configs?.tip_toggle,
            configs?.blog_toggle,
            configs?.comments_toggle === 1 ? 0 : 1,
            configs?.news_toggle,
            siteLogo,
            fontColor,
            primaryThemeColor,
            secondaryThemeColor,
            primaryButtonColor,
            secondaryButtonColor,
            siteName,
            siteSquareLogo,
            siteLogoFront,
            mediaConfig,
            headerFooterBgColor,
            headerFooterFontColor,
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
                getData();
            });
    }

    const handleThemeColor = () => {
        setIsEditModePrimaryThemeColor(false)
        setIsEditModeSecondaryThemeColor(false)
        setIsEditModePrimaryButtonColor(false)
        setIsEditModeSecondaryButtonColor(false)
        setIsEditModeFontColor(false)
        setIsEditModeHeaderFooterBgColor(false)
        setIsEditModeHeaderFooterFontColor(false)
        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        updateGeneralConfigs(
            accessToken,
            configs?.id,
            configs?.tip_toggle,
            configs?.blog_toggle,
            configs?.comments_toggle,
            configs?.news_toggle,
            siteLogo,
            fontColor,
            primaryThemeColor,
            secondaryThemeColor,
            primaryButtonColor,
            secondaryButtonColor,
            siteName,
            siteSquareLogo,
            siteLogoFront,
            mediaConfig,
            headerFooterBgColor,
            headerFooterFontColor
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
                getData();
            });
    }

    const handleSiteLogo = () => {
        setIsEditModeImage(false)
        setIsEditModeFrontImage(false)
        setIsEditModeSquareImg(false)
        setLoading(true);

        const mediaConfig = {
            facebook_link: facebookName,
            instagram_link: instagramName,
            twitter_link: twitterName,
        };
        {
            checkImage || checkSquareImage || checkFrontImage ? (
                updateGeneralConfigs(
                    accessToken,
                    configs?.id,
                    configs?.tip_toggle,
                    configs?.blog_toggle,
                    configs?.comments_toggle,
                    configs?.news_toggle,
                    siteLogo,
                    fontColor,
                    primaryThemeColor,
                    secondaryThemeColor,
                    primaryButtonColor,
                    secondaryButtonColor,
                    siteName,
                    siteSquareLogo,
                    siteLogoFront,
                    mediaConfig,
                    headerFooterBgColor,
                    headerFooterFontColor
                )
                    .then(({ data }) => {
                        toast.success(data?.message, {
                            theme: "dark",
                        });
                        setBase64ImageArr(null);
                        setBase64ImageArrFront(bull)
                        setBase64ImageArrForSquare(null);
                        setFilesImage(null)
                        setFilesImageFront(null)
                        setFilesImageForSqurelogo(null)
                    })
                    .catch((error) => {
                        toast.error(error?.response?.data?.description, {
                            theme: "dark",
                        });
                    })
                    .finally(() => {
                        getData();
                    })
            ) : null
        }

    }

    const accessToken = useSelector((state) => state?.userData?.access_token);

    const handleEditClick = (data) => {
        setIsEditModeFontColor(data === "ColorChange" ? true : false);
        setIsEditModeHeaderFooterBgColor(data === "ColorChange" ? true : false);
        setIsEditModeHeaderFooterFontColor(data === "ColorChange" ? true : false);
        setIsEditModePrimaryThemeColor(data === "ColorChange" ? true : false);
        setIsEditModeSecondaryThemeColor(data === "ColorChange" ? true : false)
        setIsEditModePrimaryButtonColor(data === "ColorChange" ? true : false)
        setIsEditModeSecondaryButtonColor(data === "ColorChange" ? true : false)
        setIsEditModeSiteName(data === "Name" ? true : false)
        setIsEditModefacebookName(data === "Name" ? true : false)
        setIsEditModeinstagramName(data === "Name" ? true : false)
        setIsEditModetwitterName(data === "Name" ? true : false)
        setIsEditModeImage(data === "image" ? true : false);
        setIsEditModeFrontImage(data === "frontImage" ? true : false)
        setIsEditModeSquareImg(data === "squareLogo" ? true : false);
        setFontColor(configs?.font_color)
        setHeaderFooterBgColor(configs?.header_footer_bg_color)
        setHeaderFooterFontColor(configs?.header_footer_font_color)
        setPrimaryThemeColor(configs?.primary_theme_color)
        setSecondaryThemeColor(configs?.secondary_theme_color)
        setPrimaryButtonColor(configs?.primary_button_color)
        setSecondaryButtonColor(configs?.secondary_button_color)
    };

    const handleCancelClick = (data) => {
        setIsEditModeFontColor(false);
        setIsEditModeHeaderFooterBgColor(false);
        setIsEditModeHeaderFooterFontColor(false);
        setFontColor(configs?.font_color)
        setHeaderFooterBgColor(configs?.header_footer_bg_color)
        setHeaderFooterFontColor(configs?.header_footer_font_color)
        setPrimaryThemeColor(configs?.primary_theme_color)
        setSecondaryThemeColor(configs?.secondary_theme_color)
        setPrimaryButtonColor(configs?.primary_button_color)
        setSecondaryButtonColor(configs?.secondary_button_color)
        setIsEditModePrimaryThemeColor(false);
        setIsEditModeSecondaryThemeColor(false)
        setIsEditModePrimaryButtonColor(false);
        setIsEditModeSecondaryButtonColor(false)
        setIsEditModeSiteName(false)
        setIsEditModefacebookName(false)
        setIsEditModeinstagramName(false)
        setIsEditModetwitterName(false)
        setCheckImage(null)
        setCheckFrontImage(null)
        setCheckSquareImage(null)
        setSiteLogo(configs?.site_logo)
        setSiteLogoFront(configs?.site_front_logo)
        setSiteSquareLogo(configs?.site_square_logo)
        setBase64ImageArr(null)
        setBase64ImageArrForSquare(null)
        setBase64ImageArrFront(null)
        setFilesImage(null)
        setFilesImageFront(null)
        setFilesImageForSqurelogo(null)
        setIsEditModeImage(data === "image" ? false : false);
        setIsEditModeFrontImage(data === "frontImage" ? false : false)
        setIsEditModeSquareImg(data === "squareLogo" ? false : false);
    };


    const handleFilePondUpdate = (fileItems) => {
        if (fileItems.length > 0) {
            fileItems.forEach((fileItem) => {
                if (fileItem && fileItem.file instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setCheckImage(e.target.result);
                        setBase64ImageArr(e.target.result);
                    };
                    reader.readAsDataURL(fileItem.file);
                } else {
                    console.error("Invalid fileItem or fileItem.file is not a Blob");
                }
            });
        } else {
            setBase64ImageArr("");
            setCheckImage(null);
        }
        setFilesImage(fileItems);
    };
    const handleFilePondUpdateFront = (fileItems) => {
        if (fileItems.length > 0) {
            fileItems.forEach((fileItem) => {
                if (fileItem && fileItem.file instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setCheckFrontImage(e.target.result);
                        setBase64ImageArrFront(e.target.result);
                    };
                    reader.readAsDataURL(fileItem.file);
                } else {
                    console.error("Invalid fileItem or fileItem.file is not a Blob");
                }
            });
        } else {
            setBase64ImageArrFront("");
            setCheckFrontImage(null);
        }
        setFilesImageFront(fileItems);
    };
    const handleFilePondUpdateForSquraeImg = (fileItems) => {
        if (fileItems.length > 0) {
            fileItems.forEach((fileItem) => {
                if (fileItem && fileItem.file instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setCheckSquareImage(e.target.result);
                        setBase64ImageArrForSquare(e.target.result);
                    };
                    reader.readAsDataURL(fileItem.file);
                } else {
                    console.error("Invalid fileItem or fileItem.file is not a Blob");
                }
            });
        } else {
            setBase64ImageArrForSquare("");
            setCheckSquareImage(null);
        }
        setFilesImageForSqurelogo(fileItems);
    };

    const initialValues = {
        site_name: siteName ? siteName : "",
        facebook_link: facebookName ? facebookName : "",
        instagram_link: instagramName ? instagramName : "",
        twitter_link: twitterName ? twitterName : "",
    };

    useEffect(() => {
        formik.setValues(initialValues);
    }, [siteName, facebookName, instagramName, twitterName]);

    console.log(initialValues)

    const ConfigLinkchema = Yup.object().shape({
        site_name: Yup.string()
            .required("Site Links is required")
            .test(
                "no-leading-trailing-spaces",
                "Links cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        facebook_link: Yup.string()
            .required("Facebook Links is required")
            .test(
                "no-leading-trailing-spaces",
                "Links cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        instagram_link: Yup.string()
            .required("Instagram Links is required")
            .test(
                "no-leading-trailing-spaces",
                "Links cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            ),
        twitter_link: Yup.string()
            .required("Twitter Links is required")
            .test(
                "no-leading-trailing-spaces",
                "Links cannot start or end with white spaces",
                (value) => {
                    if (value) {
                        // Trim white spaces from the input
                        const trimmedValue = value.trim();
                        return trimmedValue === value; // Check if the input has leading/trailing white spaces
                    }
                    return true; // Allow empty input
                }
            )
    });



    const formik = useFormik({
        initialValues,
        validationSchema: ConfigLinkchema,
        onSubmit: (values, { setSubmitting }) => {
            setIsEditModeSiteName(false)
            setIsEditModefacebookName(false)
            setIsEditModeinstagramName(false)
            setIsEditModetwitterName(false)

            const mediaConfig = {
                facebook_link: values.facebook_link,
                instagram_link: values.instagram_link,
                twitter_link: values.twitter_link,
            };



            updateGeneralConfigs(
                accessToken,
                configs?.id,
                configs?.tip_toggle === 1 ? 0 : 1,
                configs?.blog_toggle,
                configs?.comments_toggle,
                configs?.news_toggle,
                siteLogo,
                fontColor,
                primaryThemeColor,
                secondaryThemeColor,
                primaryButtonColor,
                secondaryButtonColor,
                values.site_name,
                siteSquareLogo,
                siteLogoFront,
                mediaConfig,
                headerFooterBgColor,
                headerFooterFontColor
            )
                .then(({ data }) => {
                    toast.success(data?.message, {
                        theme: "dark",
                    });
                    setFacebookName(values.facebook_link);
                    setInstagramName(values.instagram_link);
                    setTwitterName(values.twitter_link);

                })
                .catch((error) => {
                    toast.error(error?.response?.data?.description, {
                        theme: "dark",
                    });
                })
                .finally(() => {
                    getData();
                });
        }
    });

    return (
        <div className='pb-4'>
            <Seo title={"General configurations"} />
            {/* General config title start */}
            <Card className="mt-4">
                <Card.Body className="py-0">
                    <div className="breadcrumb-header justify-content-between">
                        <div className="left-content">
                            <span className="main-content-title mg-b-0 mg-b-lg-1">
                                General configurations
                            </span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            {/* General config title end */}


            {/* <!-- row --> */}
            <Row>
                <Col lg={12} xl={12} >
                    <Row>
                        <Col md={4} className='mb-4'>
                            <Card className="px-3  d-flex flex-column justify-content-between h-100 min-height-300 shadow-search ">

                                {isEditModeImage ? (
                                    <div className='preview-img-config'>
                                        <Form.Label className="text-muted form-label ">
                                            Update admin site logo
                                        </Form.Label>
                                        <FilePond
                                            className="mt-3"
                                            files={filesimage}
                                            allowReorder={true}
                                            allowMultiple={false}
                                            allowFileTypeValidation={true}
                                            acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                            onupdatefiles={handleFilePondUpdate}
                                            maxFileSize={10 * 1024 * 1024}
                                            imagePreviewHeight={170}
                                            imageResizeTargetHeight={200}
                                            labelMaxFileSizeExceeded={'File is too large'}
                                            labelIdle='Drag & Drop your file or <span className="filepond--label-action">Browse</span>'
                                            onerror={(error) => {
                                                setImgUploadError(error)
                                            }}
                                        />
                                    </ div>
                                ) : (<>
                                    <Form.Label className="form-label text-muted">
                                        Current admin site logo
                                    </Form.Label>
                                    <div className='border preview-img-config' >
                                        {siteLogo ? ( // Check if there's a site logo data
                                            <div className="text-center h-100">
                                                <img
                                                    src={siteLogo}
                                                    alt="Site Logo"
                                                    className="h-100"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </>)}
                                <FormGroup>
                                    <div className="horizontal-row "></div>
                                    <div className="my-2 text-end">
                                        {isEditModeImage ? (
                                            <>
                                                <button className="btn btn-secondary me-2" onClick={() => {
                                                    handleCancelClick("image");
                                                }}>
                                                    Cancel
                                                </button>


                                                {
                                                    checkImage && imgUploadError === "" ? (
                                                        <Button variant="primary" type="submit" id="submitButton" onClick={handleSiteLogo} className={` ${imgUploadError ? 'disabled' : null}`} >
                                                            {/* <button className="btn btn-primary"
                                                            onClick={handleSiteLogo}
                                                        > */}
                                                            Submit
                                                            {/* </button> */}
                                                        </Button>
                                                    ) : null}
                                            </>
                                        ) : (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id={`tooltip-top`}>Update logo</Tooltip>}
                                            >
                                                <i className="fe fe-edit cursor-pointer" onClick={() => {
                                                    handleEditClick("image");
                                                }}></i>
                                            </OverlayTrigger>
                                        )}
                                    </div>
                                </FormGroup>
                            </Card>
                        </Col>
                        <Col md={4} className='mb-4'>
                            <Card className="px-3  d-flex flex-column justify-content-between h-100 min-height-300 shadow-search">

                                {isEditModeFrontImage ? (
                                    <div className='preview-img-config'>
                                        <Form.Label className="text-muted form-label ">
                                            Update front site logo
                                        </Form.Label>
                                        <FilePond
                                            className="mt-3"
                                            files={filesimageFront}
                                            allowReorder={true}
                                            allowMultiple={false}
                                            allowFileTypeValidation={true}
                                            acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                            onupdatefiles={handleFilePondUpdateFront}
                                            maxFileSize={10 * 1024 * 1024}
                                            imagePreviewHeight={170}
                                            imageResizeTargetHeight={200}
                                            labelMaxFileSizeExceeded={'File is too large'}
                                            labelIdle='Drag & Drop your file or <span className="filepond--label-action">Browse</span>'
                                            onerror={(error) => {
                                                setImgUploadError(error)
                                            }}
                                        />

                                    </ div>
                                ) : (<>
                                    <Form.Label className="form-label text-muted">
                                        Current front site logo
                                    </Form.Label>
                                    <div className='border preview-img-config' >
                                        {siteLogoFront ? ( // Check if there's a site logo data
                                            <div className="text-center h-100">
                                                <img
                                                    src={siteLogoFront}
                                                    alt="Site Logo"
                                                    className="h-100"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </>)}
                                <FormGroup>
                                    <div className="horizontal-row "></div>
                                    <div className="my-2 text-end">
                                        {isEditModeFrontImage ? (
                                            <>
                                                <button className="btn btn-secondary me-2" onClick={() => {
                                                    handleCancelClick("frontImage");
                                                }}>
                                                    Cancel
                                                </button>
                                                {
                                                    checkFrontImage && imgUploadError === "" ? (
                                                        <Button variant="primary" type="submit" id="submitButton" onClick={handleSiteLogo} className={` ${imgUploadError ? 'disabled' : null}`} >

                                                            Submit
                                                        </Button>
                                                    ) : null}
                                            </>
                                        ) : (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id={`tooltip-top`}>Update logo</Tooltip>}
                                            >
                                                <i className="fe fe-edit cursor-pointer" onClick={() => {
                                                    handleEditClick("frontImage");
                                                }}></i>
                                            </OverlayTrigger>
                                        )}
                                    </div>
                                </FormGroup>
                            </Card>
                        </Col>
                        <Col md={4} className='mb-4'>
                            <Card className="px-3  d-flex flex-column justify-content-between h-100 min-height-300 shadow-search">

                                {isEditModeSquareImg ? (
                                    <div className='preview-img-config'>
                                        <Form.Label className="text-muted form-label ">
                                            Update Square logo
                                        </Form.Label>

                                        <FilePond
                                            className="mt-3"
                                            files={filesimageForSqurelogo}
                                            allowReorder={true}
                                            allowMultiple={false}
                                            allowFileTypeValidation={true}
                                            acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                            onupdatefiles={handleFilePondUpdateForSquraeImg}
                                            maxFileSize={10 * 200 * 184}
                                            labelMaxFileSizeExceeded={'File is too large'}
                                            labelIdle='Drag & Drop your file or <span className="filepond--label-action">Browse</span>'
                                            onerror={(error) => {
                                                setImgUploadError(error)
                                            }}
                                        />
                                    </ div>
                                ) : (<>
                                    <Form.Label className="form-label text-muted">
                                        Square logo
                                    </Form.Label>
                                    <div className='border preview-img-config' >
                                        {siteSquareLogo ? ( // Check if there's a site logo data
                                            <div className="text-center h-100">
                                                <img
                                                    src={siteSquareLogo}
                                                    alt="Site Logo"
                                                    className="h-100"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </>)}
                                <FormGroup>
                                    <div className="horizontal-row "></div>
                                    <div className="my-2 text-end">
                                        {isEditModeSquareImg ? (
                                            <>
                                                <button className="btn btn-secondary me-2" onClick={() => {
                                                    handleCancelClick("squareLogo");
                                                }}>
                                                    Cancel
                                                </button>

                                                {
                                                    checkSquareImage && imgUploadError === "" ? (
                                                        <Button variant="primary" type="submit" id="submitButton" onClick={handleSiteLogo} className={` ${imgUploadError ? 'disabled' : null}`} >

                                                            Submit
                                                        </Button>
                                                    ) : null}
                                            </>
                                        ) : (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id={`tooltip-top`}>Update logo</Tooltip>}
                                            >
                                                <i className="fe fe-edit cursor-pointer" onClick={() => {
                                                    handleEditClick("squareLogo");
                                                }}></i>
                                            </OverlayTrigger>
                                        )}
                                    </div>
                                </FormGroup>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} md={6} lg={6} xl={4} xxl={4} className="mb-3 mb-xl-0">
                            <Card className='shadow-search mt-md-4 mb-0 mt-0 d-flex h-100'>
                                <Card.Body className='d-flex flex-column'>
                                    <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100 mb-4">
                                        <div className='d-flex align-items-center'>
                                            <i className="fe fe-alert-circle me-2 text-warning"></i>
                                            <span>
                                                Tip
                                            </span>
                                        </div>
                                        <div>
                                            <label className="switch switch-flat m-0">
                                                {configs?.tip_toggle === 1 ? (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleTip}
                                                        defaultChecked
                                                    />
                                                ) : (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleTip}
                                                    />
                                                )}

                                                <span
                                                    className="switch-label"
                                                    data-on="Active"
                                                    data-off="Inactive"
                                                ></span>
                                                <span className="switch-handle"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="tx-16 text-muted d-flex w-100 justify-content-between align-items-center w-100 mb-4">
                                        <div className='d-flex align-items-center'>
                                            <i className="fe fe-file-plus me-2"></i>
                                            <span>
                                                Blog
                                            </span>
                                        </div>
                                        <div>
                                            <label className="switch switch-flat m-0">
                                                {configs?.blog_toggle === 1 ? (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleBlog}
                                                        defaultChecked
                                                    />
                                                ) : (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleBlog}
                                                    />
                                                )}
                                                <span
                                                    className="switch-label"
                                                    data-on="Active"
                                                    data-off="Inactive"
                                                ></span>
                                                <span className="switch-handle"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100 mb-4">
                                        <div className='d-flex align-items-center'>
                                            <i className="far fa-newspaper me-2"></i>
                                            <span>
                                                News
                                            </span>
                                        </div>
                                        <div>
                                            <label className="switch switch-flat m-0">
                                                {configs?.news_toggle === 1 ? (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleNews}
                                                        defaultChecked
                                                    />
                                                ) : (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleNews}
                                                    />
                                                )}
                                                <span
                                                    className="switch-label"
                                                    data-on="Active"
                                                    data-off="Inactive"
                                                ></span>
                                                <span className="switch-handle"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="tx-16 text-muted d-flex justify-content-between align-items-center w-100">
                                        <div className='d-flex align-items-center'>
                                            <i className="ion ion-md-chatboxes me-2"></i>
                                            <span>
                                                Comments
                                            </span>
                                        </div>
                                        <div>
                                            <label className="switch switch-flat m-0">
                                                {configs?.comments_toggle === 1 ? (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleComments}
                                                        defaultChecked
                                                    />
                                                ) : (
                                                    <input className="switch-input" type="checkbox"
                                                        onClick={handleComments}
                                                    />
                                                )}
                                                <span
                                                    className="switch-label"
                                                    data-on="Active"
                                                    data-off="Inactive"
                                                ></span>
                                                <span className="switch-handle"></span>
                                            </label>
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>



                        </Col>
                        <Col sm={12} md={6} lg={6} xl={4} xxl={4} className="mb-3 mb-xl-0">
                            <Card className='w-100 shadow-search mt-md-4 mb-0 mt-0 card d-flex h-100'>
                                <Card.Body className='d-flex align-items-center flex-column'>
                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className=' align-items-center  tx-16 text-muted w-100'>
                                            <i className="ion ion-ios-contrast me-2"></i>
                                            <span>
                                                Primary button color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModePrimaryButtonColor ? (

                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1 cursor-pointer"
                                                        value={primaryButtonColor}
                                                        onChange={(e) => setPrimaryButtonColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1"
                                                        value={primaryButtonColor}
                                                        disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-contrast me-2"></i>
                                            <span>
                                                Secondary theme color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModeSecondaryThemeColor ? (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1 cursor-pointer"
                                                        value={secondaryThemeColor}
                                                        onChange={(e) => setSecondaryThemeColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1"
                                                        value={secondaryThemeColor}
                                                        disabled />
                                                )}
                                            </span>

                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-contrast me-2"></i>
                                            <span>
                                                Primary theme color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModePrimaryThemeColor ? (

                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1 cursor-pointer"
                                                        value={primaryThemeColor}
                                                        onChange={(e) => setPrimaryThemeColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1"
                                                        value={primaryThemeColor}
                                                        disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-contrast me-2"></i>
                                            <span>
                                                Secondary button color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModeSecondaryButtonColor ? (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1 cursor-pointer"
                                                        value={secondaryButtonColor}
                                                        onChange={(e) => setSecondaryButtonColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="ThemecolorPicker" className="format-input ms-2 p-1"
                                                        value={secondaryButtonColor}
                                                        disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-color-palette me-2"></i>
                                            <span>
                                                Font color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModeFontColor ? (
                                                    <input type="color" id="colorPicker"
                                                        className="format-input ms-2 p-1 cursor-pointer"
                                                        value={fontColor} // Set the value of the color picker
                                                        onChange={(e) => setFontColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="colorPicker" className="format-input ms-2 p-1" value={fontColor} disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-color-palette me-2"></i>
                                            <span>
                                                Header/Footer background color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModeHeaderFooterBgColor ? (
                                                    <input type="color" id="colorPicker"
                                                        className="format-input ms-2 p-1 cursor-pointer"
                                                        value={headerFooterBgColor} // Set the value of the color picker
                                                        onChange={(e) => setHeaderFooterBgColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="colorPicker" className="format-input ms-2 p-1" value={headerFooterBgColor} disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                    <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                        <div className='align-items-center w-100 tx-16 text-muted'>
                                            <i className="ion ion-ios-color-palette me-2"></i>
                                            <span>
                                                Header/Footer font color
                                            </span>
                                            <span className='float-right'>
                                                {isEditModeHeaderFooterFontColor ? (
                                                    <input type="color" id="colorPicker"
                                                        className="format-input ms-2 p-1 cursor-pointer"
                                                        value={headerFooterFontColor} // Set the value of the color picker
                                                        onChange={(e) => setHeaderFooterFontColor(e.target.value)}
                                                    />
                                                ) : (
                                                    <input type="color" id="colorPicker" className="format-input ms-2 p-1" value={headerFooterFontColor} disabled />
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="color_module_div w-100">
                                        <div className="horizontal-row "></div>
                                        <div className='w-100 d-flex justify-content-end my-2'>
                                            <div>
                                                {isEditModePrimaryButtonColor ? (
                                                    <>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id={`tooltip-top`}>Close</Tooltip>}
                                                        >
                                                            <i className="fe fe-x-circle me-2 cursor-pointer" onClick={() => {
                                                                handleCancelClick("primaryButtonColor");
                                                            }}>
                                                            </i>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id={`tooltip-top`}>Submit</Tooltip>}
                                                        >
                                                            <i className='fe fe-check cursor-pointer'
                                                                onClick={handleThemeColor}
                                                            ></i>
                                                        </OverlayTrigger>
                                                    </>
                                                ) : (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                                                    >
                                                        <i className="fe fe-edit cursor-pointer" onClick={() => {
                                                            handleEditClick("ColorChange");
                                                        }}></i>
                                                    </OverlayTrigger>
                                                )}
                                            </div>
                                        </div>
                                    </div>



                                </Card.Body>

                            </Card>
                        </Col>

                        <Col sm={12} md={6} lg={6} xl={4} xxl={4} className="mb-3 mb-xl-0">
                            <Card className='w-100 shadow-search mb-0 mt-4 h-100'>
                                <Card.Body className=''>


                                    <Form
                                        className='h-100 d-flex flex-column'
                                        onSubmit={(e) => {
                                            e.preventDefault(); // Prevent the default form submission
                                            formik.handleSubmit(); // Trigger form submission
                                        }}
                                    >
                                        <div className='d-flex align-items-center mb-3'>
                                            <div className='w-100 tx-16 text-muted flex-wrap'>
                                                <i className="ion ion-ios-contrast me-2"></i>
                                                <span>
                                                    Site name
                                                </span>
                                                <span className='float-right'>
                                                    {isEditModeSiteName ? (

                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.site_name}
                                                            name="site_name"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                        />
                                                    ) : (
                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.site_name}
                                                            disabled />
                                                    )}
                                                    {formik.touched.site_name && formik.errors.site_name ? (
                                                        <div className="fv-plugins-message-container">
                                                            <div className="fv-help-block text-danger">
                                                                {formik.errors.site_name}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </span>

                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center mb-3'>
                                            <div className='w-100 tx-16 text-muted flex-wrap'>
                                                <i className="ion ion-ios-contrast me-2"></i>
                                                <span>
                                                    Facebook
                                                </span>
                                                <span className='float-right'>
                                                    {isEditModefacebookName ? (

                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.facebook_link}
                                                            name="facebook_link"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            pattern="^\s*https?://\S.*\S\s*$"
                                                            title="Enter a valid URL starting with http:// or https://, Whitespaces are not allowed"
                                                        />
                                                    ) : (
                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.facebook_link}
                                                            disabled />
                                                    )}
                                                    {formik.touched.facebook_link && formik.errors.facebook_link ? (
                                                        <div className="fv-plugins-message-container">
                                                            <div className="fv-help-block text-danger">
                                                                {formik.errors.facebook_link}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </span>

                                            </div>

                                        </div>

                                        <div className='d-flex align-items-center mb-3'>
                                            <div className='w-100 tx-16 text-muted flex-wrap'>
                                                <i className="ion ion-ios-contrast me-2"></i>
                                                <span>
                                                    Instagram
                                                </span>
                                                <span className='float-right'>
                                                    {isEditModeinstagramName ? (

                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.instagram_link}
                                                            name="instagram_link"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            pattern="^\s*https?://\S.*\S\s*$"
                                                            title="Enter a valid URL starting with http:// or https://, Whitespaces are not allowed"
                                                        />
                                                    ) : (
                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.instagram_link}
                                                            disabled />
                                                    )}
                                                    {formik.touched.instagram_link && formik.errors.instagram_link ? (
                                                        <div className="fv-plugins-message-container">
                                                            <div className="fv-help-block text-danger">
                                                                {formik.errors.instagram_link}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </span>

                                            </div>

                                        </div>

                                        <div className='d-flex align-items-center'>
                                            <div className='w-100 tx-16 text-muted flex-wrap'>
                                                <i className="ion ion-ios-contrast me-2"></i>
                                                <span>
                                                    Twitter
                                                </span>
                                                <span className='float-right'>
                                                    {isEditModetwitterName ? (

                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.twitter_link}
                                                            name="twitter_link"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            pattern="^\s*https?://\S.*\S\s*$"
                                                            title="Enter a valid URL starting with http:// or https://, Whitespaces are not allowed"
                                                        />
                                                    ) : (
                                                        <input type="text" className="format-input ms-2 p-1"
                                                            value={formik.values.twitter_link}
                                                            disabled />
                                                    )}
                                                    {formik.touched.twitter_link && formik.errors.twitter_link ? (
                                                        <div className="fv-plugins-message-container">
                                                            <div className="fv-help-block text-danger">
                                                                {formik.errors.twitter_link}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="social_links_div">
                                            <div className="horizontal-row "></div>
                                            <div className='d-flex justify-content-end w-100 my-2'>
                                                <div className='d-flex'>
                                                    {isEditModeSiteName ? (
                                                        <>
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={<Tooltip id={`tooltip-top`}>Close</Tooltip>}
                                                            >
                                                                <i className="fe fe-x-circle me-2 cursor-pointer" onClick={() => {
                                                                    handleCancelClick("Name");
                                                                }}>
                                                                </i>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger

                                                                placement="top"
                                                                overlay={<Tooltip id={`tooltip-top`} >Submit</Tooltip>}
                                                            >

                                                                <Button type="submit" className='p-0 cursor-pointer social_link_btn text-dark bg-transparent border-0 px-0'>
                                                                    <i className='fe fe-check cursor-pointer'></i>
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </>
                                                    ) : (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                                                        >
                                                            <i className="fe fe-edit cursor-pointer" onClick={() => {
                                                                handleEditClick("Name");
                                                            }}></i>
                                                        </OverlayTrigger>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>

                </Col>
            </Row >
            <ToastContainer />
        </div >
    )
};

generalConfigs.propTypes = {};

generalConfigs.defaultProps = {};

generalConfigs.layout = "Contentlayout"

export default generalConfigs;
