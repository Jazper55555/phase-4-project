import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function AddReview({ user }) {
  const { id: instrumentId } = useParams();
  const [message, setMessage] = useState('');

  const validationSchema = Yup.object({
    content: Yup.string()
      .required("Review content is required")
      .max(300, "Review can't be longer than 300 characters"),
    rating: Yup.number()
      .required("Rating is required")
      .integer("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating can't be more than 5"),
  });

  const formik = useFormik({
    initialValues: {
      content: '',
      rating: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const reviewData = { ...values, instrument_id: instrumentId };

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
          resetForm();
        } else {
          setMessage(data.errors.join(', '));
        }
      })
      .catch(() => setMessage('Network error'));
    },
  });

  if (!user) {
    return <p>Please log in to add a review.</p>;
  }

  return (
    <div className="add-review-container">
      <h2>Add Review</h2>
      <form onSubmit={formik.handleSubmit}>
        <br />
        <div>
          <label htmlFor='content'>Review</label>
          <input
            type="text"
            id='content'
            name='content'
            value={formik.values.content}
            onChange={formik.handleChange}
          />
          {formik.errors.content ? <p style={{ color: 'black' }}><br/>{formik.errors.content}</p> : null}
        </div>
        <br />
        <div>
          <label htmlFor='rating'>Rating</label>
          <input
            type="number"
            id='rating'
            name='rating'
            value={formik.values.rating}
            onChange={formik.handleChange}
            min="1" max="5"
          />
          {formik.errors.rating ? <p style={{ color: 'black' }}><br/>{formik.errors.rating}</p> : null}
        </div>
        <br />
        {message && <p>{message}</p>}
        <br />
        <button type='submit'>Submit Review</button>
      </form>
    </div>
  );
}

export default AddReview;