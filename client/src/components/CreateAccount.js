import React, { useState } from "react";
import Modal from "./SignUpModal";

function CreateAccount() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [errors, setErrors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const formData = {
            name,
            age: parseInt(age, 10)
        };

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
                    setName('');
                    setAge('');
                    setErrors([]);
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

    return (
        <div className="account-container">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>Create Account</h2>
                    <br></br>
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

// import React, { useState } from "react";
// import Modal from "./SignUpModal";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";

// function CreateAccount() {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('');

//   const validationSchema = Yup.object({
//     name: Yup.string()
//       .required("Name is required")
//       .max(50),
//     age: Yup.number()
//       .typeError("Age must be a number")
//       .required("Age is required")
//       .integer("Age must be an integer")
//       .min(18),
//   });

//   function handleFormikSubmit(values, actions) {
//     fetch('/members', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(values),
//     })
//     .then((r) => {
//       if (r.ok) {
//         r.json().then(() => {
//           actions.resetForm();
//           setSuccessMessage('Account successfully created!');
//           setIsModalOpen(false);
//         });
//       } else {
//         r.json().then((err) => {
//           actions.setErrors({ api: err.errors || ['Unknown error occurred'] });
//           setSuccessMessage('');
//         });
//       }
//     })
//     .catch(() => {
//       actions.setErrors({ api: ['Network error'] });
//       setSuccessMessage('');
//     });
//   }

//   return (
//     <div className="account-container">
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <Formik
//           initialValues={{ name: '', age: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleFormikSubmit}
//         >
//           {({ errors }) => (
//             <Form>
//               <h2>Create Account</h2>
//               <br />
//               <div className="name-container">
//                 <label htmlFor="name">Name</label>
//                 <Field name="name" type="text" />
//                 <ErrorMessage name="name" component="div" style={{ color: 'black' }} />
//               </div>
//               <div className="age-container">
//                 <label htmlFor="age">Age</label>
//                 <Field name="age" type="text" />
//                 <ErrorMessage name="age" component="div" style={{ color: 'black' }} />
//               </div>
//               {errors.api && <p style={{ color: 'black' }}>{errors.api}</p>}
//               {successMessage && <p style={{ color: 'white' }}>{successMessage}</p>}
//               <br />
//               <button type="submit">Sign Up!</button>
//             </Form>
//           )}
//         </Formik>
//       </Modal>
//     </div>
//   );
// }

// export default CreateAccount;