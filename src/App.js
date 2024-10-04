import React, { useState } from "react";
import WebcamCapture from "./webcam";
function App() {
  const [imageSrc, setImageSrc] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Processing</h1>
        <WebcamCapture imgState={imageSrc} setImgState={setImageSrc} />
        {imageSrc && (
          <img src={imageSrc} alt="screenshot" />
        )}
      </header>
    </div>
  );
}

export default App;
