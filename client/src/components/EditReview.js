import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditReview({ user }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const { id: reviewId } = useParams(); // Assume the route provides the review ID

  useEffect(() => {
    fetch(`/reviews/${reviewId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            if (data.review.member_id !== user.id) {
                setMessage('You can only edit your own reviews.');
                return;
              }
            setContent(data.review.content);
            setRating(data.review.rating);
        }   else {
            setMessage('Failed to load review.');
        }
      })
      .catch(() => setMessage('Network error'));
  }, [reviewId, user.id]);

  function handleSubmit(e) {
    e.preventDefault();
    const reviewData = { content, rating: parseInt(rating, 10) };

    fetch(`/reviews/${reviewId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Review updated successfully!');
      } else {
        setMessage(data.errors.join(', '));
      }
    })
    .catch(() => setMessage('Network error'));
  }

  if (!user) {
    return <p>Please log in to edit a review.</p>;
  }

  return (
    <div className="edit-review-container">
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='content'>Review</label>
          <input
            type="text"
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='rating'>Rating</label>
          <input
            type="number"
            id='rating'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1" max="5"
          />
        </div>
        {message && <p>{message}</p>}
        <button type='submit'>Update Review</button>
      </form>
    </div>
  );
}

export default EditReview;