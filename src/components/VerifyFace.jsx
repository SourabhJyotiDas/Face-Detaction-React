import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const VerifyFace = ({ savedDescriptors }) => {
  const webcamRef = useRef(null); // Add the webcamRef
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [result, setResult] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleVerifyFace = async () => {
   const imageSrc = webcamRef.current?.getScreenshot();
   if (imageSrc) {
     const img = new Image();
     img.src = imageSrc;
 
     img.onload = async () => {
       const detections = await faceapi
         .detectSingleFace(img)
         .withFaceLandmarks()
         .withFaceDescriptor();
 
       if (detections) {
         const descriptor = detections.descriptor;
 
         // Compare with all saved descriptors
         let match = false;
         savedDescriptors.forEach((saved) => {
           const distance = faceapi.euclideanDistance(descriptor, saved);
           if (distance < 0.6) {
             match = true;
           }
         });
 
         if (match) {
           setResult("✅ Match found: Same person!");
         } else {
           setResult("❌ No match found.");
         }
       } else {
         setResult("❌ No face detected.");
       }
     };
   }
 };
 

  return (
    <div>
      <h2>Verify Face</h2>
      {!modelsLoaded && <p>Loading models...</p>}
      {isCameraActive && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="300"
            height="200"
          />
          <br />
          <button onClick={handleVerifyFace}>Capture</button>
        </>
      )}
      {!isCameraActive && <button onClick={() => setIsCameraActive(true)}>Start Camera</button>}
      <h3>{result}</h3>
    </div>
  );
};

export default VerifyFace;
