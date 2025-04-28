import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const detectFaces = async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      const predictions = await model.estimateFaces(video);
      setFaces(predictions);
    }
  };

  useEffect(() => {
    const interval = setInterval(detectFaces, 100);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
      />
      {faces.length > 0 && (
        <div>
          {faces.map((face, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: face.topLeft[0],
                top: face.topLeft[1],
                width: face.bottomRight[0] - face.topLeft[0],
                height: face.bottomRight[1] - face.topLeft[1],
                border: "2px solid red",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
