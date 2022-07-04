import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
  OrbitControls,
  useProgress,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import { useSnapshot } from "valtio";
import snapState from "/components/snapState";

import { BsLaptop } from "react-icons/bs";
import { GoDesktopDownload } from "react-icons/go";

// const baseUrl = "http://localhost:3001/";
const baseUrl = "/";
const fileBasePath = baseUrl + "objects/";
const defaultFileName = "dress 3 colors.glb";

const ClotheModel = (props) => {
  const { deviceType } = props;
  const importInputRef = useRef();
  const modelRef = useRef();

  const [nodes, setNodes] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);

  const snap = useSnapshot(snapState);
  const { progress } = useProgress();

  // console.log({ nodes, materials })

  useEffect(() => {
    loadModel(defaultFileName);
  }, []);

  useEffect(() => {
    if (file) {
      uploadToServer()
        .then((res) => {
          reloadModel(file.name);
        })
        .catch((err) => console.log(err));
    }
  }, [file]);

  const loadModel = (fname) => {
    const url = fileBasePath + fname;

    const loader = new GLTFLoader();
    loader.load( url, async (gltf) => {
      const _nodes = await gltf.parser.getDependencies("node");
      const _materials = await gltf.parser.getDependencies("material");
      // console.log({ _nodes, _materials })
      setNodes(filterNodes(_nodes));
      setMaterials(_materials);
    });

    // try {
    //   const { nodes, materials } = await useGLTF(url);
    //   // console.log({ _nodes: nodes, _materials: materials, counts: Object.keys(nodes).length })
    //   setNodes(nodes);
    //   setMaterials(materials);
    // } catch (err) {
    //   setTimeout(() => {
    //     loadModel(fname);
    //   }, 200);
    // }
  };

  const filterNodes = (nodes) => {
    const gorupNodes = nodes.find(n => n.type === "Group")?.children || []
    const meshNodes = nodes.filter(n => n.type === "Mesh") || []
    return [...gorupNodes, ...meshNodes]
  }

  const importFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      const f = event.target.files[0];
      setFile(f);
    }
  };

  const reloadModel = (fname) => {
    snapState.current = null;
    snapState.items = {};
    snapState.textures = {};
    loadModel(fname);
    setFileName(fname)
    setFile(null);
  };

  const uploadToServer = async () => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(baseUrl + "api/file", {
      method: "POST",
      body,
    });
    return response;
  };

  const exportFile = () => {
    const exporter = new GLTFExporter();
    const params = {
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      binary: true,
      maxTextureSize: 4096,
    };
    const options = {
      trs: params.trs,
      onlyVisible: params.onlyVisible,
      truncateDrawRange: params.truncateDrawRange,
      binary: params.binary,
      maxTextureSize: params.maxTextureSize,
    };

    const scenes = modelRef.current.children;

    exporter.parse(
      scenes,
      function (result) {
        let fname = fileName
        fname = fname.replace(".glb", "")
        fname = fname.replace(".gltf", "")
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, `${fname}.glb`);
        } else {
          const output = JSON.stringify(result, null, 2);
          saveString(output, `${fname}.gltf`);
        }
      },
      function (error) {
        console.log("An error happened during parsing", error);
      },
      options
    );
  };

  function save( blob, filename ) {
    const link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); 

    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
  }

  function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
  }

  function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
  }

  const loadCursor = (materialName) => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[materialName]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${materialName}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    document.getElementById(
      "canvas-content"
    ).style.cursor = `url('data:image/svg+xml;base64,${btoa(
      materialName ? cursor : auto
    )}'), auto`;
  };

  const getTexture = (materialName) => {
    // const texture = new THREE.TextureLoader().load("textures/texture.png")
    if (!snap.textures[materialName]) return null;
    const image = new Image();
    image.src = snap.textures[materialName];

    const texture = new THREE.Texture();
    image.onload = function () {
      texture.needsUpdate = true;
    };

    texture.image = image;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.anisotropy = 12;
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;

    // const oMaterial = materials[materialName]
    const material = new THREE.MeshStandardMaterial({
      name: materialName,
      map: texture,
      side: THREE.DoubleSide,
    });
    return material;
  };

  const renderSpinner = () => {
    return (
      <>
        {progress !== 100 && (
          <div
            className="w-100 h-100 d-flex justify-content-center align-items-center position-absolute"
            style={{ zIndex: 2 }}
          >
            <Spinner animation="border" variant="warning" size="lg" />
          </div>
        )}
      </>
    );
  };

  const renderActionButtons = () => {
    return (
      <div
        className={`position-absolute d-flex ${
          deviceType === "desktop" ? "flex-row" : "flex-column"
        }`}
        style={{ zIndex: 3 }}
      >
        <Button
          variant="secondary"
          className={deviceType === "desktop" ? "m-2" : "m-2 mb-1"}
          size="sm"
          disabled={progress !== 100}
          onClick={() => importInputRef.current.click()}
        >
          <BsLaptop size="1.2rem" />
        </Button>
        <input
          ref={importInputRef}
          type="file"
          name="file"
          onChange={importFile}
          className="d-none"
        />
        <Button
          variant="secondary"
          className={deviceType === "desktop" ? "m-2" : "mx-2 my-1"}
          size="sm"
          disabled={progress !== 100}
          onClick={exportFile}
        >
          <GoDesktopDownload size="1.2rem" />
        </Button>
      </div>
    );
  };

  const renderMaterialName = () => {
    return (
      <>
        {snap.current && (
          <div
            className="w-100 position-absolute d-flex justify-content-end px-2"
            style={{ zIndex: 2 }}
          >
            <p className="m-0 fw-bold" style={{ color: "#f77200" }}>
              {snap.current}
            </p>
          </div>
        )}
      </>
    );
  };

  const renderMeshes = () => {
    // const nodeKeys = Object.keys(nodes) || [];
    if (nodes.length < 1) return <></>;
    if (!snap.items) return <></>;

    const result = [];
    nodes.forEach((meshNode, index) => {
      // const meshNode = nodes[key];
      if (meshNode.type === "Mesh" && meshNode.material) {
        const material = snap.textures[meshNode.material.name]
          ? getTexture(meshNode.material.name)
          : meshNode.material;
        if (snap.items[meshNode.material.name]) {
          material.color = new THREE.Color(snap.items[meshNode.material.name]);
          result.push(
            <mesh
              key={index}
              receiveShadow
              geometry={meshNode.geometry}
              material={material ? material : materials[meshNode.material.name]}
            />
          );
        } else {
          result.push(
            <mesh
              key={index}
              receiveShadow
              geometry={meshNode.geometry}
              material={material ? material : materials[meshNode.material.name]}
            />
          );
        }
      } else {
        result.push(
          <mesh
            key={index}
            receiveShadow
            geometry={meshNode.geometry}
          />
        );
      }
    });
    return result;
  };

  if (!nodes || !materials) return <></>;

  return (
    <div className="model-content">
      {renderActionButtons()}
      {renderSpinner()}
      {renderMaterialName()}
      <Canvas
        id="canvas-content"
        className="canvas-content"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1] }}
      >
        <ambientLight intensity={0.2} />
        <spotLight
          intensity={0.2}
          angle={0.1}
          penumbra={0.5}
          position={[10, 15, 10]}
        />
        <Suspense fallback={null}>
          <group
            ref={modelRef}
            dispose={null}
            position={[0, -0.9, 0]}
            onPointerOver={(e) => (
              e.stopPropagation(), loadCursor(e.object.material.name)
            )}
            onPointerOut={(e) =>
              e.intersections.length === 0 && loadCursor(null)
            }
            onPointerMissed={() => (snapState.current = null)}
            onPointerDown={(e) => (
              e.stopPropagation(), (snapState.current = e.object.material.name)
            )}
          >
            {renderMeshes()}
          </group>
          <Environment files="royal_esplanade_1k.hdr" />
          {/* <Environment preset="forest" /> */}
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -0.8, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={2}
            far={1}
          />
        </Suspense>
        <OrbitControls
          // minPolarAngle={0}
          // maxPolarAngle={Math.PI}
          minDistance={0.5}
          maxDistance={1.5}
          enableZoom={true}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};

export default ClotheModel;
