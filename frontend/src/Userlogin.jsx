import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [isChecked, setIsChecked] = useState(false);

    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const [error, setError] = useState('')



    const handleSubmit = (event) => {
        event.preventDefault();
        if (isChecked) {
        axios.post('http://localhost:8081/login', values)
        .then(res => {
            if(res.data.Status === 'Success') {
                navigate('/');
            } else {
                setError(res.data.Error);
            }
        })
        .catch(err => console.log(err));
    }
    else{
        setError("Please agree to our terms")
    }
}

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-danger'>
                    {error && error}
                </div>
                <h2>Login to Aaryash</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email" style={{ marginRight: '40px' }}><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email' 
                          onChange={e => setValues({...values, email: e.target.value})} className='form-control rounded-0' autoComplete='off'/>
                    </div>
                    <div className='mb-3' style={{ marginTop: '10px' }}>
                        <label htmlFor="password" style={{ marginRight: '10px' } }><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                          onChange={e => setValues({...values, password: e.target.value})} className='form-control rounded-0' />
                    </div>
                    <button type='submit' className='btn btn-success vh-20 w-25 rounded-0'  style={{ marginTop: '10px', marginBottom:'10px' }}> Log in</button>
                    <div className='mb-3'>
            <label>
              <input
                type="checkbox"
                name="terms"
                checked={isChecked}
                onChange={e => {
                  setIsChecked(e.target.checked);
                  setError(""); // Clear the error message when the checkbox is checked
                }}
                style={{ marginRight: '5px' }}
              />
              You agree to our terms and policies
            </label>
          </div>
                </form>
            </div>
        </div>
    )
}

export default Login