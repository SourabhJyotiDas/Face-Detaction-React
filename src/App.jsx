import React, { useState } from "react";
import AddFace from "./components/AddFace";
import VerifyFace from "./components/VerifyFace";
import FaceDetection from "./components/FaceDetaction";

function App() {
  const [savedDescriptors, setSavedDescriptors] = useState([]);

  console.log("savedDescriptors--->", savedDescriptors);

  const handleAddFace = (descriptor) => {
    setSavedDescriptors((prev) => [...prev, descriptor]);
  };

  return (
    <div className="App">
      <h1>Face Verification App 🚀</h1>
      <AddFace onFaceAdded={handleAddFace} />
      <VerifyFace savedDescriptors={savedDescriptors} />
    </div>
  );
}

export default App;
