import { useEffect, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};



const WebcamCapture = ({ imgState, setImgState }) => {
    const [ButtonText, setButtonText] = useState("Start prediction");
    const [stop, setStop] = useState(false);
    return (
        <Webcam
            audio={false}
            height={1080}
            screenshotFormat="image/jpeg"
            width={1720}
            videoConstraints={videoConstraints}
        >
            {({ getScreenshot }) => (
                <button onClick={() => {
                    if (ButtonText === "Stop prediction") {
                        setStop(true);
                    }
                    setButtonText("Stop prediction");

                    function predict() {
                        const imageSrc = getScreenshot();

                        fetch("http://127.0.0.1:5000/upload-image/", {
                            method: "POST",
                            body: JSON.stringify({ imageSrc }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                            mode: "cors",
                        })
                            .then(async res => {
                                if (res.ok) {
                                    return res.json();
                                } else {
                                    throw new Error("Network response was not ok.");
                                }
                            })
                            .then(buffer => {
                                try {
                                    console.log("img state set")
                                    console.log(buffer.newBuffer)
                                    const newBuffer = "data:image/png;base64," + buffer.newBuffer
                                    setImgState(newBuffer);
                                    if (!stop) {
                                        predict();
                                    }
                                } catch (error) {
                                    console.error("Error", error);
                                }
                            })
                            .catch(err => {
                                console.error("Error:", err);
                            });
                    }

                    predict()
                }

                }>{ButtonText}</button>

            )
            }

        </Webcam >
    );
};
export default WebcamCapture