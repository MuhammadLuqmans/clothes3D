import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 400,
  facingMode: "user",
};

export default function ClotheModel(props) {
  const { captureImage } = props
  const videoRef = useRef()

  const [width, setWidth] = useState(400)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setWidth(videoRef.current.video.parentElement.clientWidth)
  }, [])

  return (
    <Webcam
      ref={videoRef}
      audio={false}
      width={width}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      onUserMedia={() => setIsActive(true)}
    >
      {({ getScreenshot }) => (
        <div className="position-absolute d-flex justify-content-center align-items-center w-100 h-100 top-0 start-0">
          {isActive && <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "#ffffff99", color: "white", width: "80px", height: "80px", cursor: "pointer" }}
            onClick={() => {
              const imageSrc = getScreenshot();
              captureImage(imageSrc);
            }}
          >
            <p className="m-0">Capture</p>
          </div>}
        </div>
      )}
    </Webcam>
  );
}
