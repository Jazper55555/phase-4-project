import React, { useEffect, useState } from "react";

function Instruments() {
    const [instruments, setInstruments] = useState([])
    const [selectedInstrument, setSelectedInstrument] = useState(null)
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetch('instruments')
            .then((r) => r.json())
            .then(setInstruments)
    }, [])

    function handleClick(instrument) {
        fetch(`/instruments/${instrument.id}`) 
        .then((r) => r.json())
        .then((data) => {
            console.log(data.reviews)
            setSelectedInstrument(data.instrument)
            setReviews(data.reviews)
        })
    }

    return (
            <div className="instruments-container">
                <h1>Instruments</h1>
                <br></br>
                <ul className="instruments-list">
                    {instruments.map((instrument) => (
                        <li key={instrument.id} className="instrument-item">
                            <img src={instrument.image} alt={`${instrument.name}'s image`} className="instrument-image" onClick={() => handleClick(instrument)}/>
                            <div className="instrument-info">
                            <span className="instrument-name">{instrument.name}</span>
                            <span className="instrument-price">${instrument.price}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {selectedInstrument && (
                <div className="selected-instrument">
                    <h2>{selectedInstrument.name}</h2>
                    <br></br>
                    <img src={selectedInstrument.image} alt={`${selectedInstrument.name}'s image`} className="instrument-image" />
                    <p>Price: ${selectedInstrument.price}</p>
                    <h3>Reviews</h3>
                    <ul>
                        {reviews.map((review) => (
                            <li key={review.id}>
                                <p>{review.content}</p>
                                <p>Rating: {review.rating}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                )}
            </div>
    )
}

export default Instruments