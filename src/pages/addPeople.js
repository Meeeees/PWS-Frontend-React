import styles from "../styles/app.module.css";
import config from "../config.json";
import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
const AddPeople = () => {
    const [name, setName] = useState("");
    const [Status, setStatus] = useState(null);
    const [voltooid, setVoltooid] = useState(false);
    const [gestart, setGestart] = useState(false);
    const [mensen, setMensen] = useState([]);

    useEffect(() => {
        fetch(config.Backend + "/info?type=2").then(async res => {
            res = await res.json()
            setMensen(res)
        })
    }, [])


    return (
        <div>
            <h3>Beheer gezichten</h3>
            <div className={styles.SubDivisionAdd}>
                <img className={styles.video} src={`${config.Backend}/video`} alt="live feed" />
                <div>
                    <TextField value={name} onChange={(e) => setName(e.target.value)} variant="outlined" type="text" name="naam" placeholder="naam" error={Status == null ? false : true}
                        helperText={Status} />
                    <Button variant="outlined" onClick={() => {
                        setGestart(true)
                        fetch(config.Backend + "/start?name=" + name).then(async res => {
                            res = await res.json()
                            if (res.status === 400) {
                                setStatus("De naam mag niet leeg zijn")
                            } else if (res.status === 409) {
                                setStatus(`de naam ${name} is al in gebruik`)
                            } else {
                                setVoltooid(true);
                            }
                        })
                    }}>{!gestart ? "Video opnemen" : "Video wordt opgenomen"}</Button>
                    <p>Neem een video waarbij de contouren van je gezicht duidelijk zijn, zorg ervoor dat de belichting zo goed mogelijk is.</p>
                    <p>Deze video zal 5 seconde duren, probeer langszaam aan te bewegen terwijl je de camera recht aan kijkt</p>
                    <p>{voltooid && "Het opnemen van de video is voltooid!"}</p>
                </div>
            </div>
        </div>
    )
}

export default AddPeople