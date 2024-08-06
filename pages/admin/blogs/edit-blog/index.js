import React from "react";
import dynamic from "next/dynamic";
import Seo from "@/shared/layout-components/seo/seo";

/* Import  Create-Blog-com file which include form of create blog start */
const EditBlogCom = dynamic(() => import("./editBlogCom"), {
  ssr: false,
});
/* Import  Create-Blog-com file which include form of create blog start */

const Create = () => {
  return (
    <div>
      <Seo title={"Edit Blog"} />
      {/* render Create-Blog-com form using function start*/}
      <EditBlogCom />
      {/* render Create-Blog-com form using function end*/}
    </div>
  );
};
Create.layout = "Contentlayout"; // To render sidebar
export default Create;
