import { useState } from "react";
import {useFormik} from 'formik'
import * as Yup from 'yup'

function SignIn({setUser}) {
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');
  
    const validationSchema = Yup.object({
      name: Yup.string()
        .required("Name is required")
        .max(50),
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email format - must include @')
      });
  
      const formik = useFormik({
        initialValues: {
            name: '',
            email: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, {resetForm}) => {
          fetch('/login', {
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
              setMessage('Log in successful!');
              const userData = {id: data.user_id, name: values.name, email:values.email}
              setUser(userData)
              localStorage.setItem('user', JSON.stringify(userData))
              setErrors([]);
            } else {
              setErrors(data.errors || ['Login failed']);
              setMessage('');
            }
          })
          .catch(() => setErrors(['Network error']));
        }
      })
  
    return (
        <div className="signin-container">
            <br></br>
          <h2 className="signin-text">Sign In</h2>
          <form onSubmit={formik.handleSubmit}>
            <br></br>
            <br></br>
            <div className="form-field">
              <label htmlFor='name'>Name</label>
              <input
                type="name"
                id='name'
                name='name'
                placeholder="First Last"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name ? <p className='error-text' style={{ color: 'black' }}>{formik.errors.name}</p> : null}
            </div>
            <br></br>
            <div className="form-field">
              <label htmlFor='email'>Email</label>
              <input
                type="email"
                id='email'
                name='email'
                placeholder="first.last@percplay.com"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email ? <p className='error-text' style={{ color: 'black' }}>{formik.errors.email}</p> : null}
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