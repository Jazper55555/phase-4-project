import { useState } from "react";

function AddInstrument({ user, onAddInstrument }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const instrumentData = { name, price: parseFloat(price), image };

    fetch('/instruments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(instrumentData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Instrument added successfully!');
        setName('');
        setPrice('');
        setImage('');
        onAddInstrument(data.instrument);
      } else {
        setMessage(data.errors.join(', '));
      }
    })
    .catch(() => setMessage('Network error'));
  }

  if (!user) {
    return <p>Please log in to add an instrument.</p>;
  }

  return (
    <div className="add-instrument-container">
      <h2>Add Instrument</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name </label>
          <input
            type="text"
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor='price'>Price $ </label>
          <input
            type="number"
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
          />
        </div>
        <br />
        <div>
          <label htmlFor='image'>Image URL </label>
          <input
            type="text"
            id='image'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
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