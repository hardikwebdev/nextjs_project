import React from "react";
import dynamic from "next/dynamic";
// import Homepage from "./frontend/home";

const Homepage = dynamic(() => import("./frontend/home"), {
  ssr: false,
});

export default function Home() {
  return <Homepage />;
}
