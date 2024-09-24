import React, { useEffect, useState } from "react";

function Instruments() {
    const [instruments, setInstruments] = useState([])

    useEffect(() => {
        fetch('instruments')
            .then((r) => r.json())
            .then(setInstruments)
    }, [])

    return (
            <div className="instruments-container">
                <h1>Instruments</h1>
                <br></br>
                <ul className="instruments-list">
                    {instruments.map((instrument) => (
                        <li key={instrument.id} className="instrument-item">
                            <img src={instrument.image} alt={`${instrument.name}'s image`} className="instrument-image"/>
                            <div className="instrument-info">
                            <span className="instrument-name">{instrument.name}</span>
                            <span className="instrument-price">${instrument.price}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    )
}

export default Instruments