import styles from "../styles/app.module.css";
import { useState } from "react";
import config from "../config.json";
import { Button } from "@mui/material";

const Video = () => {
    const [info, setInfo] = useState("");
    const [imgSrc, setImgSrc] = useState("herkend/placeholder.png");
    const [progress, setProgress] = useState(0);
    const [verwachteTijd, setVerwachteTijd] = useState(0);
    let interval;
    return (
        <div className={styles.videoContainer}>
            <div className={styles.subDivision}>
                <div>
                    <h3>live beeld</h3>
                    <img className={styles.video} src={`${config.Backend}/video`} alt="live feed" />
                </div>
                {imgSrc && (
                    <div>
                        <h3>{imgSrc == "herkend/placeholder.png" ? "Nog geen gezicht herkend in deze sessie" : "laatste herkende foto"}</h3>
                        <img className={styles.video} src={config.Backend + "/" + imgSrc} alt="laatste herkende foto" />
                    </div>
                )}
            </div>
            <Button variant="outlined" onClick={() => {
                fetch(config.Backend + "/info?type=0").then(async res => {
                    res = await res.json()
                    if (res.NeedToTrain) {
                        setInfo("Het model moet worden getraind doordat er onlangs nieuwe foto's zijn toegevoegd, progressie:")
                        interval = setInterval(() => {
                            fetch(config.Backend + "/info?type=1").then(async res => {
                                res = await res.json()
                                setProgress((parseInt(res)))
                                if (res == 100) {
                                    clearInterval(interval);
                                    setInfo("Het model is getraind, het systeem zal nu gezichts herkenning gaan uitvoeren");
                                    setProgress(null);
                                }
                            })
                        }, 1000);
                    }
                })
                fetch(config.Backend + "/recognize").then(async res => {
                    res = await res.json()
                    console.log(res)
                    setImgSrc(res);
                    clearInterval(interval);
                })
            }}>recognize</Button>
            <p>{info}</p>
            {info && <progress value={progress} max={100} />}

        </div>)
}

export default Video