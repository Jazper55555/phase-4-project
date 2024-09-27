import React, { useState } from "react";
import Modal from "./SignUpModal";

function CreateAccount() {
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [errors, setErrors] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [successMessage, setSuccessMessage] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const formData = {
            name, 
            age: parseInt(age, 10)
        }

        fetch('/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
        .then((r) => {
            if (r.ok) {
                r.json().then(() => {
                    setName('')
                    setAge('')
                    setErrors([])
                    setIsModalOpen(false)
                    setSuccessMessage('Account successfully created!');
                })
            }   else {
                r.json().then((err) => {
                    setErrors(err.errors)
                    setSuccessMessage(''); 
                })
            }
        })
    }

    return (
        <div className="account-container">
            {/* <button onClick={() => setIsModalOpen(true)}>Create Account</button> */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {successMessage && <p>{successMessage}</p>} 
                <form onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <div className="name-container">
                        <label htmlFor='name'>Name</label>
                        <input
                            type="text"
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="age-container">
                        <label htmlFor='age'>Age</label>
                        <input
                            type="text"
                            id='age'
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    {errors.length > 0 ? 
                        errors.map((err) => (
                            <p key={err} style={{color: 'black'}}>{err}</p>
                        ))
                    : null}
                    <br></br>
                    <button type='submit'>Sign Up!</button>
                </form>
            </Modal>
        </div>
    )
}

export default CreateAccount