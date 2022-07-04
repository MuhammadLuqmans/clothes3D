import React, { Suspense, useState, useRef, useEffect } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import { useUserAgent } from "next-useragent"
import Div100vh from 'react-div-100vh'

import "bootstrap/dist/css/bootstrap.min.css"

import Header from "/components/Header"
import Footer from "/components/Footer"
import PropertiesList from "/components/PropertiesList"
import TexturePanel from "/components/TexturePanel"
import ColorPanel from "/components/ColorPanel"
import ClotheModel from "/components/ClotheModel"

import snapState from "/components/snapState"

const desktopLayoutStyle = {
  width: "30%",
  maxWidth: "500px"
}

const mobileLayoutStyle = {
  width: "100%",
  height: "80px"
}

export default function Home(props) {
  const ua = useUserAgent(props.uaString || window.navigator.userAgent);
  // const ua = useUserAgent(window.navigator.userAgent);
  const deviceType =
    !ua.isMobile && !ua.isDesktop
      ? "tablet"
      : ua.isDesktop
      ? "desktop"
      : "mobile";

  console.log({ deviceType })

  return (
    <Div100vh>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Head>
          <title>3dlamoda</title>
          <meta name="description" content="3dlamoda" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div
          className="model-content d-flex flex-fill"
          style={{
            flexDirection: deviceType !== "desktop" ? "column" : "row",
          }}
        >
          <div className="flex-fill">
            <ClotheModel deviceType={deviceType} />
          </div>
          <div style={deviceType === "desktop" ? desktopLayoutStyle : mobileLayoutStyle}>
            <PropertiesList
              deviceType={deviceType}
              items={[
                <TexturePanel key="texture" name="Texture" deviceType={deviceType} />,
                <ColorPanel key="color" name="Color" deviceType={deviceType} />,
              ]}
            />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </Div100vh>
  );
}

export function getServerSideProps(context) {
  return {
    props: {
      uaString: context.req.headers["user-agent"],
    },
  };
}
