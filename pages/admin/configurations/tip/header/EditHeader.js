import React from "react";
import dynamic from "next/dynamic";
import Seo from "@/shared/layout-components/seo/seo";

/* Import  Add-Banner-com file which include form of add baner start */
const AddHeader = dynamic(() => import("./EditHeaderCom"), {
  ssr: false,
});
/* Import  Add-Banner-com file which include form of add baner end */

const Create = () => {
  return (
    <div>
      <Seo title={"Edit Header"} />

      {/* render Add-Banner-com forms using function start*/}
      <AddHeader />
      {/* render Add-Banner-com forms using function end*/}

    </div>
  );
};
Create.layout = "Contentlayout"; // To render sidebar
export default Create;
