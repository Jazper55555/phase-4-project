import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import AddInstrument from "./AddInstrument";

function MemberDetails({ user }) {
  const { id } = useParams();
  const history = useHistory()
  const [member, setMember] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    fetch(`/members/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setMember(data.member);
        setReviews(data.reviews || []);
        const uniqueInstruments = Array.from(
          new Set((data.reviews || []).map(review => review.instrument.id))
        ).map(id => {
          return data.reviews.find(review => review.instrument.id === id).instrument;
        });
        setInstruments(uniqueInstruments);
      });
  }, [id, instruments]);

  const handleReviewsClick = () => setShowReviews(true);

  const handleInstrumentsClick = () => setShowReviews(false)

  const handleAddInstrument = (newInstrument) => {
    setInstruments([...instruments, newInstrument]);
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedContent(review.content);
  };

  const handleDeleteClick = (reviewId) => {
    fetch(`/reviews/${reviewId}`, {
      method: 'DELETE'
    })
    .then((response) => {
      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
      } else {
        return response.json().then((data) => {
          console.error(data.errors);
        });
      }
    })
    .catch(() => console.error('Network error'));
  }

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

  function handleImageClick(instrument) {
    history.push(`/instruments/${instrument.id}`)
  }

  return (
    <div className="selected-member">
      <h2 className="member-name">{member.name}</h2>
      <br />
      <img src={member.avatar} alt={`${member.name}'s avatar`} className="member-image" />
      <button className="member-reviews-button" onClick={handleReviewsClick}>Reviews</button>
      <button className="member-instruments-button" onClick={handleInstrumentsClick}>Instruments</button>
      <br />
      {successMessage && <p className="success-message">{successMessage}</p>}

      {showReviews ? (
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
                  <div className='edit-button'>
                    <button className='edit-button' onClick={() => handleEditClick(review)}>Edit</button>
                    <button className='edit-button' onClick={() => handleDeleteClick(review.id)}>Delete</button>
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <ul className="instruments-list">
            {instruments.map((instrument) => (
              <li key={instrument.id} className="instrument-item">
                <img src={instrument.image} alt={`${instrument.name}'s image`} className="instruments-image" onClick={() => handleImageClick(instrument)} />
                <div className="instrument-info">
                  <span className="instruments-name">{instrument.name}</span>
                  <span className="instrument-price">${instrument.price}</span>
                </div>
              </li>
            ))}
          </ul>
          {user && member && user.id === member.id && (
            <div>
              <AddInstrument user={user} onAddInstrument={handleAddInstrument} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MemberDetails;