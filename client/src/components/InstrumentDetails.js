import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

function InstrumentDetails({user}) {
    const {id} = useParams()
    const [instrument, setInstrument] = useState(null)
    const [reviews, setReviews] = useState([])
    const history = useHistory()

    useEffect(() => {
        fetch(`/instruments/${id}`)
        .then((r) => r.json())
        .then((data) => {
            setInstrument(data.instrument)
            setReviews(data.reviews)
        })
    }, [id])

    if (!instrument) return <h3>Instrument Not Found...</h3>

    function StarRating({ rating }) {
        const fullStar = '★' 
        const emptyStar = '☆'
      
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <span key={i}>
              {i <= rating ? fullStar : emptyStar}
            </span>
          );
        }
      
        return <div>{stars}</div>;
      }

    const handleEdit = (reviewId) => {
        history.push(`/edit-review/${reviewId}`)
    }

    return (
        <div className="selected-instrument">
            <h2 className="instrument-name">{instrument.name}</h2>
            <br></br>
            <img src={instrument.image} alt={`${instrument.name}'s image`} className="instrument-image" />
            <br></br>
            <h3 className="instrument-name">Price: ${instrument.price}</h3>
            <br></br>
            <h3>Reviews</h3>
            <br></br>
            <ul className="reviews-list">
                {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                        <div className="review-header">
                            <img src={review.member.avatar} alt={`${review.member.name}'s avatar`} className="review-avatar" />
                            <div className="review-details">
                                <span className="reviewer-name">{review.member.name}</span>
                                <StarRating rating={review.rating} />
                            </div>
                        </div>
                        <p className="review-content">{review.content}</p>
                        {user && user.id === review.member.id && (
                            <button onClick={() => handleEdit(review.id)}>Edit</button>
                        )}
                    </li>
                ))}
            </ul>
            <br></br>
        </div>
        )
}

export default InstrumentDetails