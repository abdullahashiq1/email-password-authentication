import './App.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameBlur = event => {
    setName(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }
  
  const handleRegisteredChange = e => {
    setRegistered(e.target.checked);
  }

  const handleFormSubmit = event => {

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      
      event.stopPropagation();
      return;
    }

    if(!/(?=.*?[#?!@$%^&*-])/.test(password)){
      setError('Password at least one special character');
      return;
    }
    setValidated(true);
    setError('');

    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result =>{
        const user = result.user;
        console.log(user);

      })
      .catch(error => {
        console.log(error);
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();
    })
      .catch(error => {
        console.log(error);
        setError(error.message);
    })
    }

    event.preventDefault();
  }

  const setUserName = () =>{
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() =>{
      console.log('Updating name');
    })
    .catch(() => {
      setError(error.message);
    })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log('Email Verication Sent');
    })
    
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
    .then(() =>{
      console.log('Email sent');
    })

  }

  return (
    <div>
        <div className="registration w-50 mx-auto mt-3">
          <h2 className='text-primary'>Please {registered ? "Login": "Register"}!</h2>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required onBlur={handleEmailBlur} type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
                We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
                Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

        { !registered && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control required onBlur={handleNameBlur} type="text" placeholder="Your Name"/>
          <Form.Control.Feedback type="invalid">
              Please provide your name
          </Form.Control.Feedback>
        </Form.Group>}

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required onBlur={handlePasswordBlur} type="password" placeholder="Password" />
            <Form.Control.Feedback type="invalid">
                Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already registered?" />
          </Form.Group>

          <p className='text-success'>{'Success'}</p>
          <p className="text-danger">{error}</p>
           <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
           <br/>
          <Button variant="primary" type="submit">
              {registered ? 'Login':'Register'}
          </Button>
        </Form>
        </div>
    </div>
  );
}

export default App;
