import React, { useState } from "react";
import Modal from "./SignUpModal";
import {useFormik} from 'formik'
import * as Yup from 'yup'

function CreateAccount() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(50),
    age: Yup.number()
      .typeError("Age must be a number")
      .required("Age is required")
      .integer("Age must be an integer")
      .min(18, "You must be at least 18 years old to sign up"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            age: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, {resetForm}) => {
            fetch('/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values),
        })
        .then((r) => {
            if (r.ok) {
                r.json().then(() => {
                    resetForm()
                    setSuccessMessage('Account successfully created!');
                    setIsModalOpen(false); 
                });
            } else {
                r.json().then((err) => {
                    setErrors(err.errors || ['Unknown error occurred']);
                    setSuccessMessage(''); 
                });
            }
        })
        .catch(() => {
            setErrors(['Network error']);
            setSuccessMessage('');
        });
        }
    })

    return (
        <div className="account-container">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={formik.handleSubmit}>
                    <h2>Create Account</h2>
                    <br></br>
                    <div className="name-container">
                        <label htmlFor='name'>Name</label>
                        <input
                            type="text"
                            id='name'
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.name ? <p style={{ color: 'black' }}>{formik.errors.name}</p> : null}
                    </div>
                    <div className="age-container">
                        <label htmlFor='age'>Age</label>
                        <input
                            type="text"
                            id='age'
                            name='age'
                            value={formik.values.age}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.age ? <p style={{ color: 'black' }}>{formik.errors.age}</p> : null}
                    </div>
                    {errors.length > 0 && errors.map((err, index) => (
                        <p key={index} style={{color: 'black'}}>{err}</p>
                    ))}
                    {successMessage && <p style={{color: 'white'}}>{successMessage}</p>}
                    <br></br>
                    <button type='submit'>Sign Up!</button>
                </form>
            </Modal>
        </div>
    );
}

export default CreateAccount