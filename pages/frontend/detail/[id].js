import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Seo from "@/shared/layout-components/seo/seo";
import { getDetails } from "@/shared/services/Front_Apis/blogPage/blogPageCrud";
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import { getProfile } from '@/shared/services/Front_Apis/account/accountCrud';

const ViewBlogComWithoutImg = dynamic(() => import("./videoDetailBlog"), {
  ssr: false,
});
const ViewBlogComWithImg = dynamic(() => import("./imageDetailBlog"), {
  ssr: false,
});
const ViewNewsComWithoutImg = dynamic(() => import("./videoDetailNews"), {
  ssr: false,
});
const ViewNewsComWithImg = dynamic(() => import("./imageDetailNews"), {
  ssr: false,
});

const BlogDetail = () => {
  const [detailData, setDetailData] = useState("")
  const [profile, setProfile] = useState("");
  const router = useRouter();
  const slug = router.query

  console.log("detailData", detailData);
  const access_token = useSelector((state) => state?.frontEndUserData?.access_token);

  const getBlogNewsDetails = (parsedSlug) => {
    getDetails(parsedSlug)
      .then(({ data }) => {
        setDetailData(data?.blogOrNewDetails)
      })
      .catch((error) => {
        console.log("error******", error);
        if (error && error?.response?.data?.description === "Data not found!") {
          let path = `/404`;
          router.push(path);
        }
      })
  }

  const profileData = () => {
    if (access_token) {
      getProfile(access_token)
        .then(({ data }) => {
          setProfile(data.userProfileData);
        })
        .catch((error) => {
        })
        .finally(() => {
        })
    }
  }

  useEffect(() => {
    profileData();
  }, [access_token])




  useEffect(() => {
    const parsedSlug = slug ? parseInt(slug?.id?.split("_")[1]) : null;
    if (parsedSlug && parsedSlug !== NaN) {
      getBlogNewsDetails(parsedSlug);
    }
  }, [slug])





  useEffect(() => {
    if (detailData?.content_type === "paid" && access_token === undefined) {
      let path = `/account/login`;
      router.push(path);
    }
  }, [detailData])

  useEffect(() => {
    if (profile) {
      if (detailData?.content_type === "paid" && profile?.subscriptionData?.plan_id !== 2) {
        let path = `/profile/subscription-plan`;
        router.push(path);
      }
    }

  }, [profile])


  return (
    <div>
      <Seo title={detailData?.post_type === 'blog' ? "Blog Detail" : "News Detail"} />
      {detailData &&
        <>
          {detailData?.parsedBanner[0]?.type === "blog_video" ?
            <>
              {detailData?.post_type === 'blog' ?
                <ViewBlogComWithoutImg data={detailData} />
                :
                <ViewNewsComWithoutImg data={detailData} />
              }
            </>
            :
            <>
              {detailData?.post_type === 'blog' ?
                <ViewBlogComWithImg data={detailData} />
                :
                <ViewNewsComWithImg data={detailData} />
              }
            </>
          }
        </>
      }


    </div>
  );
};
export default BlogDetail;
