import React, { useState } from "react";

function CreateAccount() {
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [errors, setErrors] = useState([])

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
                })
            }   else {
                r.json().then((err) => setErrors(err.errors))
            }
        })
    }

    return (
        <div className="account-container">
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
                <button type='submit'>Sign Up!</button>
            </form>
        </div>
    )
}

export default CreateAccount