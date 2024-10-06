import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function MemberDetails() {
    const {id} = useParams()
    const [member, setMember] = useState(null)
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetch(`/members/${id}`)
        .then((r) => r.json())
        .then((data) => {
            setMember(data.member)
            setReviews(data.reviews)
            console.log(data.reviews)
        })
    }, [id])

    if (!member) return <h3>Member Not Found...</h3>

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

      return (
        <div className="selected-member">
            <h2 className="member-name">{member.name}</h2>
            <br></br>
            <img src={member.avatar} alt={`${member.name}'s avatar`} className="member-image" />
            <br></br>
            {/* <h3 className="instrument-name">Price: ${reviews.instrument.price}</h3> */}
            <br></br>
            <h3>Instruments/Reviews</h3>
            <br></br>
            <ul className="reviews-list">
                {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                        <div className="review-header">
                            <img src={review.instrument.image} alt={`${review.instrument.name}'s image`} className="review-avatar" />
                            <div className="review-details">
                                <span className="reviewer-name">{review.instrument.name}</span>
                                <StarRating rating={review.rating} />
                            </div>
                        </div>
                        <p className="review-content">{review.content}</p>
                    </li>
                ))}
            </ul>
        </div>
        )

}

export default MemberDetails