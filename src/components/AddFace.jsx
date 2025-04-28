import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const AddFace = ({ onFaceAdded }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleCapture = async () => {
  const imageSrc = webcamRef.current.getScreenshot();
  const blob = await fetch(imageSrc).then(res => res.blob()); // Convert base64 to Blob
  const image = await faceapi.bufferToImage(blob); // Use the Blob with face-api.js
  const detections = await faceapi.detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (detections) {
    onFaceAdded(detections.descriptor);
    alert('✅ Face added successfully!');
  } else {
    alert('❌ No face detected, please try again.');
  }
};

  return (
    <div>
      <h2>Add New Face</h2>
      {!modelsLoaded && <p>Loading models...</p>}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="300"
        videoConstraints={{ facingMode: "user" }}
      />
      <br />
      <button onClick={handleCapture}>Capture</button>
    </div>
  );
};

export default AddFace;
