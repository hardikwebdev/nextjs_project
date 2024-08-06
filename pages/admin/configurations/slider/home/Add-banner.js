import React from "react";
import dynamic from "next/dynamic";
import Seo from "@/shared/layout-components/seo/seo";

/* Import  Add-Banner-com file which include form of add baner start */
const AddBanner = dynamic(() => import("./Add-Banner-com"), {
  ssr: false,
});
/* Import  Add-Banner-com file which include form of add baner end */

const Create = () => {
  return (
    <div>
      <Seo title={"Add Banner"} />

      {/* render Add-Banner-com forms using function start*/}
      <AddBanner />
      {/* render Add-Banner-com forms using function end*/}
      
    </div>
  );
};
Create.layout = "Contentlayout"; // To render sidebar
export default Create;
