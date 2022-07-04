import React, { useRef, useState } from "react";
import ImageUploading from "react-images-uploading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useSnapshot } from "valtio";
import snapState from "/components/snapState";
import WebCamera from "/components/WebCamera";
import MobilePropertyItemWrap from "/components/MobilePropertyItemWrap";
import MobilePropertyItemView from "/components/MobilePropertyItemView";

import { BiRefresh } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { BiCamera } from "react-icons/bi";
import { GrClose } from "react-icons/gr";

const TexturePanel = (props) => {
  const { deviceType } = props;
  const [images, setImages] = useState([]);
  const [cameraToggle, setCameraToggle] = useState(false);
  const [mobileImageUploadShow, setMobileImageUploadShow] = useState(false);

  const imageRef = useRef(null);
  const snap = useSnapshot(snapState);

  const loadTexture = (data_url) => {
    snapState.textures[snap.current] = data_url;
  };

  const onChange = (imageList, addUpdateIndex) => {
    setImages([...imageList]);
    if (imageList.length > 0) {
      loadTexture(imageList[0].data_url);
    }
  };

  function onWebCamImage(data) {
    setImages([
      {
        data_url: data,
      },
    ]);
    loadTexture(data);
    setCameraToggle(false);
  }

  function onMobileImageUpload(e) {
    setMobileImageUploadShow(!mobileImageUploadShow);
  }

  function renderMobileImageUpload() {
    return (
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
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
                height: 200,
              }}
              ref={imageRef}
            >
              {imageList[0] && (
                <img
                  src={imageList[0]?.data_url || ""}
                  // width={imageRef.current.clientWidth}
                  // height={imageRef.current.clientWidth}
                  // layout="fill"
                  // objectFit="contain"
                  style={{ objectFit: "contain" }}
                  className="image-el w-100"
                  alt="Upload image"
                  // onClick={imageList[0] ? onClickImage : onImageUpload}
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
            <div className="image-upload-button-content d-flex">
              <Button
                className="mx-1"
                variant="warning"
                size="sm"
                alt="Update"
                onClick={() => onImageUpdate(0)}
              >
                <BiRefresh size="1.5rem" />
              </Button>
              <Button
                className="mx-1"
                variant="warning"
                size="sm"
                alt="Remove"
                onClick={() => (onImageRemove(0), loadTexture(null))}
              >
                <BsTrash size="1.5rem" />
              </Button>
              <Button
                className="mx-1"
                variant="warning"
                size="sm"
                alt="Take Photo"
                onClick={() => setCameraToggle(!cameraToggle)}
              >
                <BiCamera size="1.5rem" />
              </Button>
            </div>
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
        )}
      </ImageUploading>
    );
  }

  return deviceType === "desktop" ? (
    <ImageUploading
      multiple={false}
      value={images}
      onChange={onChange}
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
        <div className="d-flex">
          <div
            className="image-item d-flex flex-fill"
            style={{
              flex: 1,
              marginRight: 6,
              // minHeight: 300,
              height: 300,
              width: 300,
            }}
            ref={imageRef}
          >
            {imageList[0] && (
              <img
                src={imageList[0]?.data_url || ""}
                // width={imageRef.current.clientWidth}
                // height={imageRef.current.clientWidth}
                // layout="fill"
                // objectFit="contain"
                style={{ objectFit: "contain" }}
                className="image-el w-100"
                alt="Upload image"
                // onClick={imageList[0] ? onClickImage : onImageUpload}
              />
            )}
            {!imageList[0] && (
              <div
                className="image-drag-content"
                style={isDragging ? { color: "red", background: "grey" } : null}
                onClick={onImageUpload}
                {...dragProps}
              >
                <span>Click or Drop here</span>
              </div>
            )}
          </div>
          <div className="image-upload-button-content d-flex flex-column">
            <Button
              className="mb-2"
              variant="warning"
              alt="Update"
              onClick={() => onImageUpdate(0)}
            >
              <BiRefresh size="1.5rem" />
            </Button>
            <Button
              className="mb-2"
              variant="warning"
              alt="Remove"
              onClick={() => (onImageRemove(0), loadTexture(null))}
            >
              <BsTrash size="1.5rem" />
            </Button>
            <Button
              className="mb-2"
              variant="warning"
              alt="Take Photo"
              onClick={() => setCameraToggle(!cameraToggle)}
            >
              <BiCamera size="1.5rem" />
            </Button>
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
      )}
    </ImageUploading>
  ) : (
    <div>
      <MobilePropertyItemWrap>
        <div
          style={{
            width: 46,
            height: 46,
            backgroundColor: "grey",
            border: "1px solid #5a5a5a",
          }}
          onClick={onMobileImageUpload}
        >
          {images[0] && (
            <img
              src={images[0]?.data_url || ""}
              width={46}
              height={46}
              className="image-el w-100 h-100"
              alt="Upload image"
              // onClick={imageList[0] ? onClickImage : onImageUpload}
            />
          )}
        </div>
        <p className="m-0 text-center" style={{ color: "white", fontSize: 11 }}>
          Texture
        </p>
        <MobilePropertyItemView direction="left" show={mobileImageUploadShow}>
          {renderMobileImageUpload()}
        </MobilePropertyItemView>
      </MobilePropertyItemWrap>
    </div>
  );
};

export default TexturePanel;
