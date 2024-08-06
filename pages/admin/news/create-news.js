import React from "react";
import dynamic from "next/dynamic";
import Seo from "@/shared/layout-components/seo/seo";

/* Import  Create-News-com file which include form of create news start */
const CreateNewsCom = dynamic(() => import("./createNewsCom"), {
  ssr: false,
});

const Create = () => {
  return (
    <div>
      <Seo title={"Create News"} />
      {/* render Create-News-com form using function start*/}
      <CreateNewsCom />
      {/* render Create-News-com form using function end*/}
    </div>
  );
};
Create.layout = "Contentlayout"; // To render sidebar
export default Create;
