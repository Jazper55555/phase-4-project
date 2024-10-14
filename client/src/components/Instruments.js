import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Instruments() {
    const [instruments, setInstruments] = useState([])
    const history = useHistory()

    useEffect(() => {
        fetch('instruments')
            .then((r) => r.json())
            .then(setInstruments)
    }, [])

    function handleClick(instrument) {
        history.push(`/instruments/${instrument.id}`)
    }

    return (
            <div className="instruments-container">
                <h1>Instruments</h1>
                <br></br>
                <ul className="instruments-list">
                    {instruments.map((instrument) => (
                        <li key={instrument.id} className="instrument-item">
                            <img src={instrument.image} alt={`${instrument.name}'s image`} className="instruments-image" onClick={() => handleClick(instrument)}/>
                            <div className="instrument-info">
                            <span className="instruments-name">{instrument.name}</span>
                            <span className="instrument-price">${instrument.price}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    )
}

export default Instruments