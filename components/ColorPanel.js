import React, { Suspense, useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import ImageUploading from "react-images-uploading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useSnapshot } from "valtio";
import snapState from "/components/snapState";
import WebCamera from "/components/WebCamera";
import MobilePropertyItemWrap from "/components/MobilePropertyItemWrap";
import MobilePropertyItemView from "/components/MobilePropertyItemView";

import { BiRefresh } from "react-icons/bi"
import { BsTrash } from "react-icons/bs"
import { BiCamera } from "react-icons/bi"
import { GrClose } from "react-icons/gr";

const ColorPanel = (props) => {
  const { deviceType } = props;
  const [images, setImages] = useState([]);
  const [cameraToggle, setCameraToggle] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [mobileColorPickerShow, setMobileColorPickerShow] = useState(false);
  const [mobileImageUploadShow, setMobileImageUploadShow] = useState(false);

  const imageContentRef = useRef(null);
  const snap = useSnapshot(snapState);

  const onChangeUploadImage = (imageList, addUpdateIndex) => {
    setImages([...imageList]);
  };

  function onClickImage(evt) {
    const elPos = evt.target.getClientRects()[0];
    const x = evt.clientX - elPos.left;
    const y = evt.clientY - elPos.top;
    const color = getColorFromPosition(x, y);
    snapState.items[snap.current] = color;
  }

  function onWebCamImage(data) {
    setImages([
      {
        data_url: data,
      },
    ]);
    setCameraToggle(false);
  }

  function onMobileColorPicker(e) {
    setMobileColorPickerShow(!mobileColorPickerShow)
  }

  function onMobileColorImage(e) {
    setMobileImageUploadShow(!mobileImageUploadShow)
  }

  function getColorFromPosition(x, y) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = imageContentRef.current.getElementsByClassName("image-el")[0];
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    const imgData = context.getImageData(x, y, 1, 1).data;
    const hex =
      "#" + ("000000" + rgbToHex(imgData[0], imgData[1], imgData[2])).slice(-6);
    return hex;
  }

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  function renderMobileColorPallet() {
    return (
      <div className="w-100">
        <p className="text-center subtitle m-0">Color Pallet</p>
        <div className="d-flex flex-column justify-content-center align-items-center mb-2">
          <HexColorPicker
            className="picker m-3 mb-2"
            color={color}
            style={{ width: "140px", height: "140px" }}
            onChange={(color) => {
              setColor(color);
              snapState.items[snap.current] =
                color === "#NaNNaNNaN" ? "" : color;
            }}
          />
          <div className="d-flex flex-fill justify-content-center align-items-center">
            <span className="fs-6" style={{ color: "white" }}>Hex:&nbsp;</span>
            <span className="fs-6 fw-bold text-uppercase" style={{ color }}>
              {color}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function renderMobileImageUpload() {
    return (
      <div className="image-upload">
        <p className="text-center m-0 subtitle">Image or Photo</p>
        <ImageUploading
          multiple={false}
          value={images}
          onChange={onChangeUploadImage}
          maxNumber={1}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="d-flex flex-column p-2 align-items-center justify-content-center">
              <div
                className="image-item d-flex flex-fill mb-2"
                style={{
                  width: 200,
                  height: 200
                }}
                ref={imageContentRef}
              >
                {imageList[0] && (
                  <img
                    src={imageList[0]?.data_url || ""}
                    // width={imageContentRef.current.clientWidth}
                    // height={imageContentRef.current.clientWidth}
                    // layout="fill"
                    // objectFit="contain"
                    style={{ objectFit: "contain" }}
                    className="image-el w-100"
                    alt="Upload image"
                    onClick={imageList[0] ? onClickImage : onImageUpload}
                  />
                )}
                {!imageList[0] && (
                  <div
                    className="image-drag-content"
                    style={
                      isDragging ? { color: "red", background: "grey" } : null
                    }
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <span>Click or Drop here</span>
                  </div>
                )}
              </div>
              <div
                className="image-upload-button-content d-flex"
              >
                <Button className="mx-1" variant="warning" size="sm" onClick={() => onImageUpdate(0)}>
                  <BiRefresh size="1.5rem" />
                </Button>
                <Button className="mx-1" variant="warning" size="sm" onClick={() => onImageRemove(0)}>
                  <BsTrash size="1.5rem" />
                </Button>
                <Button
                  className="mx-1"
                  variant="warning"
                  size="sm"
                  onClick={() => setCameraToggle(!cameraToggle)}
                >
                  <BiCamera size="1.5rem" />
                </Button>
              </div>
            </div>
          )}
        </ImageUploading>
        <Modal
          show={cameraToggle}
          fullscreen={deviceType !== "desktop"}
          centered
          contentClassName="camera-modal"
          onHide={() => setCameraToggle(false)}
        >
          <div
            className="position-absolute"
            style={{ top: 60, right: 10, zIndex: 4 }}
            onClick={() => setCameraToggle(false)}
          >
            <GrClose size="1.5rem" />
          </div>
          <Modal.Body className="d-flex align-items-center">
            <WebCamera captureImage={onWebCamImage} />
          </Modal.Body>
        </Modal>
      </div>
    )
  }

  return deviceType === "desktop" ? (
    <div>
      <div className="w-100">
        <p className="text-end subtitle">Color Pallet</p>
        <div className="d-flex">
          <HexColorPicker
            className="picker ms-3 mt-3"
            color={color}
            style={{ width: "200px", height: "200px" }}
            onChange={(color) => {
              setColor(color);
              snapState.items[snap.current] =
                color === "#NaNNaNNaN" ? "" : color;
            }}
          />
          <div className="d-flex flex-fill justify-content-center align-items-center">
            <span className="fs-6" style={{ color: "white" }}>Hex:&nbsp;</span>
            <span className="fs-5 fw-bold text-uppercase" style={{ color }}>
              {color}
            </span>
          </div>
        </div>
      </div>
      <div className="image-upload">
        <p className="text-end subtitle">Image or Photo</p>
        <ImageUploading
          multiple={false}
          value={images}
          onChange={onChangeUploadImage}
          maxNumber={1}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div style={{ display: "flex" }}>
              <div
                className="image-item d-flex flex-fill"
                style={{
                  marginRight: 6,
                  // height: imageContentRef.current?.clientWidth,
                  width: 300,
                  height: 300
                }}
                ref={imageContentRef}
              >
                {imageList[0] && (
                  <img
                    src={imageList[0]?.data_url || ""}
                    // width={imageContentRef.current.clientWidth}
                    // height={imageContentRef.current.clientWidth}
                    // layout="fill"
                    // objectFit="contain"
                    style={{ objectFit: "contain" }}
                    className="image-el w-100"
                    alt="Upload image"
                    onClick={imageList[0] ? onClickImage : onImageUpload}
                  />
                )}
                {!imageList[0] && (
                  <div
                    className="image-drag-content"
                    style={
                      isDragging ? { color: "red", background: "grey" } : null
                    }
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <span>Click or Drop here</span>
                  </div>
                )}
              </div>
              <div
                className="image-upload-button-content"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Button className="mb-2" variant="warning" onClick={() => onImageUpdate(0)}>
                  <BiRefresh size="1.5rem" />
                </Button>
                <Button className="mb-2" variant="warning" onClick={() => onImageRemove(0)}>
                  <BsTrash size="1.5rem" />
                </Button>
                <Button
                  variant="warning"
                  className="mb-2"
                  onClick={() => setCameraToggle(!cameraToggle)}
                >
                  <BiCamera size="1.5rem" />
                </Button>
              </div>
            </div>
          )}
        </ImageUploading>
      </div>
      <Modal
        show={cameraToggle}
        fullscreen={deviceType !== "desktop"}
        centered
        contentClassName="camera-modal"
        onHide={() => setCameraToggle(false)}
      >
        <Modal.Body>
          <WebCamera captureImage={onWebCamImage} />
        </Modal.Body>
      </Modal>
    </div>
  ) : (
    <div className="d-flex postion-relative">
      <MobilePropertyItemWrap key="color">
        <div
          className="mx-2"
          style={{ width: 46, height: 46, backgroundColor: color, border: "1px solid #5a5a5a", }}
          onClick={onMobileColorPicker}
        />
        <p className="m-0 text-center" style={{ color: "white", fontSize: 11 }}>Color</p>
        <MobilePropertyItemView
          direction="right"
          show={mobileColorPickerShow}
        >
          {renderMobileColorPallet()}
        </MobilePropertyItemView>
      </MobilePropertyItemWrap>
      <MobilePropertyItemWrap key="image">
        <div
          style={{ width: 46, height: 46, border: "1px solid #5a5a5a", }}
          onClick={onMobileColorImage}
        >
          {images[0] && <img
            src={images[0]?.data_url || ""}
            width={46}
            height={46}
            className="image-el w-100 h-100"
            alt="Upload image"
            // onClick={imageList[0] ? onClickImage : onImageUpload}
          />}
        </div>
        <p className="m-0 text-center" style={{ color: "white", fontSize: 11 }}>Image</p>
        <MobilePropertyItemView
          direction="right"
          show={mobileImageUploadShow}
        >
          {renderMobileImageUpload()}
        </MobilePropertyItemView>
      </MobilePropertyItemWrap>
    </div>
  );
};

export default ColorPanel;
