import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful! Welcome back.");
            navigate('/');
        } catch (err) {
            toast.error("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
            <Container>
                <Card className="w-100 mx-auto shadow-lg border-0 rounded-3" style={{ maxWidth: "450px" }}>
                    <Card.Body className="p-4 p-md-5">
                        <h2 className="text-center mb-4 fw-bold h1">Log In</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    placeholder="Enter your email" 
                                    size="lg"
                                />
                            </Form.Group>
                            <Form.Group id="password" className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="Enter your password" 
                                    size="lg"
                                />
                            </Form.Group>
                            <Button disabled={loading} className="w-100" variant="primary" type="submit" size="lg">
                                {loading ? 'Logging In...' : 'Log In'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-3">
                    Need an account? <Link to="/register">Sign Up</Link>
                </div>
            </Container>
        </div>
    );
};

export default Login;