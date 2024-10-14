import { useState } from "react";
import { useParams } from "react-router-dom";

function AddReview({ user }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const {id: instrumentId} = useParams()

  function handleSubmit(e) {
    e.preventDefault();
    const reviewData = { content, rating: parseInt(rating, 10), instrument_id: instrumentId };

    fetch('/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Review added successfully!');
        setContent('');
        setRating('');
      } else {
        setMessage(data.errors.join(', '));
      }
    })
    .catch(() => setMessage('Network error'));
  }

  if (!user) {
    return <p>Please log in to add a review.</p>;
  }

  return (
    <div className="add-review-container">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
        <br></br>
        <div>
          <label htmlFor='content'>Review</label>
          <input
            type="text"
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <br></br>
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
        <br></br>
        {message && <p>{message}</p>}
        <br></br>
        <button type='submit'>Submit Review</button>
      </form>
    </div>
  );
}

export default AddReview;