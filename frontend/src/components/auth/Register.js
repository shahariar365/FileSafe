// frontend/src/components/auth/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);

            toast.success("Registration successful! Please check your email to verify your account.");
            navigate('/login');
        } catch (err) {
            toast.error(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <Container>
                <Card className="w-100 mx-auto shadow-lg border-0" style={{ maxWidth: "400px" }}>
                    <Card.Body className="p-4">
                        <h2 className="text-center mb-4 fw-bold">Create Account</h2>
                        <Form onSubmit={handleRegister}>
                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
                            </Form.Group>
                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" />
                            </Form.Group>
                            <Form.Group id="confirm-password" className="mb-4">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm your password" />
                            </Form.Group>
                            <Button disabled={loading} className="w-100" variant="primary" type="submit">
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-3">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </Container>
        </div>
    );
};

export default Register;