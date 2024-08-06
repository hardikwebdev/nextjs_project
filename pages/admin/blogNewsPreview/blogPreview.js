import React from "react";
import Seo from "@/shared/layout-components/seo/seo";
import VideoPreview from "./videoDetail";
import ImagePreview from "./imageDetail";


const BlogPreview = ({ data }) => {
  console.log(data);
  return (
    <div>
      <Seo title={"Blog preview"} />
      {data?.parsedBanner && (data?.parsedBanner[0]?.type === "blog_video" || (!data?.parsedBanner[0]?.type && data?.parsedBanner[0]?.startsWith('data:video'))) ?
        <VideoPreview data={data} />
        :
        <ImagePreview data={data} />
      }


    </div>
  );
};
export default BlogPreview;
