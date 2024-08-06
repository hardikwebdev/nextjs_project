import React, { useEffect } from 'react'
import dynamic from 'next/dynamic';
import Head from 'next/head';
import favicon from "../../../public/assets/img/brand/favicon.png"
// const Customswitcher = dynamic(() => import("../../../shared/layout-components/switcher/Customswitcher"), {ssr: false,});



const Authenticationlayout = ({ children }) => {
  useEffect(() => {
    if(document.body){
      document.querySelector("body").classList.add("ltr","error-page1","bg-primary-admin")
    }
  
    return () => {
      document.body.classList.remove("ltr","error-page1","bg-primary-admin")
    }
  }, [])
  return (
    <>
    <Head>
        <title>Nowa</title>
        <meta name="description" content="Spruha" />
        <link rel="icon" href={favicon.src} />
        {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"></link> */}
    </Head>
    <div>{ children }</div>
    {/* <Customswitcher /> */}
    </>
  )
}

export default Authenticationlayout