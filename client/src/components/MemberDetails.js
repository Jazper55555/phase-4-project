import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function MemberDetails({ user }) {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch(`/members/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setMember(data.member);
        setReviews(data.reviews || []);
        data.reviews.forEach(review => {
            console.log(review.member_id)
        });
      });
  }, [id]);

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedContent(review.content);
  };

  const handleSaveClick = (reviewId) => {
    const updatedReview = { content: editedContent };

    fetch(`/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReview),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(reviews.map(review =>
            review.id === reviewId ? { ...review, content: editedContent } : review
          ));
          setEditingReviewId(null);
          setSuccessMessage('Review successfully edited');

          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          console.error(data.errors);
        }
      })
      .catch(() => console.error('Network error'));
  };

  if (!member) return <h3>Member Not Found...</h3>;

  function StarRating({ rating }) {
    const fullStar = '★';
    const emptyStar = '☆';

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
      <br />
      <img src={member.avatar} alt={`${member.name}'s avatar`} className="member-image" />
      <br />
      <br />
      <h3>Instruments/Reviews</h3>
      <br />
      {successMessage && <p className="success-message">{successMessage}</p>}
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
            {editingReviewId === review.id ? (
              <textarea
                className="edit-review-box"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows="3"
              />
            ) : (
              <p className="review-content">{review.content}</p>
            )}
            {user && review.member_id === user.id && (
              editingReviewId === review.id ? (
                <button className='edit-button' onClick={() => handleSaveClick(review.id)}>Save</button>
              ) : (
                <button className='edit-button' onClick={() => handleEditClick(review)}>Edit</button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberDetails;