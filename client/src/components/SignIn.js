import { useState } from "react";

function SignIn({setUser}) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');
  
    function handleSubmit(e) {
      e.preventDefault();
      const credentials = { name, email };
  
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setMessage('Log in successful!');
          setUser({id: data.user_id, name, email})
          localStorage.setItem('user', JSON.stringify({id: data.user_id, name, email}))
          setErrors([]);
        } else {
          setErrors(data.errors || ['Login failed']);
          setMessage('');
        }
      })
      .catch(() => setErrors(['Network error']));
    }
  
    return (
        <div className="signin-container">
            <br></br>
          <h2 className="signin-text">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <br></br>
            <br></br>
            <div className="form-field">
              <label htmlFor='name'>Name</label>
              <input
                type="name"
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <br></br>
            <div className="form-field">
              <label htmlFor='email'>Email</label>
              <input
                type="email"
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br></br>
            <button type='submit'>Sign In</button>
            <br></br>
            <br></br>
            {errors.length > 0 && errors.map((err, index) => (
              <p key={index} style={{color: 'red'}}>{err}</p>
            ))}
            {message && <p style={{color: 'white'}}>{message}</p>}
          </form>
        </div>
      );
  }
  
  export default SignIn;