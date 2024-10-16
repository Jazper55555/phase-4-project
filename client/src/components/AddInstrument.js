import { useState } from "react";
import {useFormik} from 'formik'
import * as Yup from 'yup'

function AddInstrument({ user, onAddInstrument }) {
  const [message, setMessage] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(50),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .integer("Price must be an integer")
      .min(0, "Price must be greater than 0"),
    image: Yup.string()
    .required('Image URL is required')
    });

    const formik = useFormik({
      initialValues: {
          name: '',
          price: '',
          image: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values, {resetForm}) => {
        fetch('/instruments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            resetForm()
            setMessage('Instrument added successfully!');
            onAddInstrument(data.instrument);
          } else {
            setMessage(data.errors.join(', '));
          }
        })
        .catch(() => setMessage('Network error'));
      }
    })

  if (!user) {
    return <p>Please log in to add an instrument.</p>;
  }

  return (
    <div className="add-instrument-container">
      <h2>Add Instrument</h2>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor='name'>Name </label>
          <input
            type="text"
            id='name'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name ? <p style={{ color: 'black' }}>{formik.errors.name}</p> : null}
        </div>
        <br />
        <div>
          <label htmlFor='price'>Price $ </label>
          <input
            type="number"
            id='price'
            name='price'
            value={formik.values.price}
            onChange={formik.handleChange}
            min="0"
          />
          {formik.errors.price ? <p style={{ color: 'black' }}>{formik.errors.price}</p> : null}
        </div>
        <br />
        <div>
          <label htmlFor='image'>Image URL </label>
          <input
            type="text"
            id='image'
            name='image'
            value={formik.values.image}
            onChange={formik.handleChange}
          />
          {formik.errors.image ? <p style={{ color: 'black' }}>{formik.errors.image}</p> : null}
        </div>
        <br />
        {message && <p>{message}</p>}
        <br />
        <button type='submit'>Submit Instrument</button>
      </form>
    </div>
  );
}

export default AddInstrument;