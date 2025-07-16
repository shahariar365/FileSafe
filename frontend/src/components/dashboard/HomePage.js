// frontend/src/components/dashboard/HomePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signOut, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Navbar, Container, Nav, Button, Form, Card, Row, Col, ProgressBar, Spinner, Alert } from 'react-bootstrap';

// আপনার Cloudinary ক্রেডেনশিয়ালগুলো এখানে দিন
const CLOUDINARY_UPLOAD_PRESET = 'filesify_uploads'; // আপনার Cloudinary প্রিসেট
const CLOUDINARY_CLOUD_NAME = 'drhmudza5'; // আপনার Cloudinary ক্লাউড নাম

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "files"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            await addDoc(collection(db, "files"), {
                userId: user.uid, name: selectedFile.name, url: data.secure_url,
                type: data.resource_type === 'raw' ? selectedFile.type : data.resource_type,
                createdAt: new Date(),
            });
            toast.success('File uploaded successfully!');
        } catch (error) {
            toast.error("File upload failed: " + error.message);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            if(document.getElementById('file-input')) {
                document.getElementById('file-input').value = null;
            }
        }
    };
    
    const handleLogout = async () => {
        await signOut(auth);
        toast.info("You have been logged out.");
    };

    const handleResendVerification = async () => {
        try {
            await sendEmailVerification(user);
            toast.success("A new verification email has been sent.");
        } catch (error) {
            toast.error("Failed to send verification email.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            </div>
        );
    }
    
    if (user && !user.emailVerified) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <Card className="text-center p-4 shadow-lg">
                    <Card.Body>
                        <Card.Title as="h2" className="mb-3">Verify Your Email</Card.Title>
                        <Card.Text>A verification link was sent to <strong>{user.email}</strong>.</Card.Text>
                        <Card.Text>Please check your inbox to activate your account.</Card.Text>
                        <Button variant="primary" onClick={handleResendVerification} className="m-2">Resend Email</Button>
                        <Button variant="outline-danger" onClick={handleLogout} className="m-2">Logout</Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand href="#home" className="fw-bold">FileSafe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {user && <Navbar.Text className="me-3">Signed in as: {user.email}</Navbar.Text>}
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5">
                <Card className="p-4 mb-5 shadow-sm border-0">
                    <h2 className="mb-4">Upload New File</h2>
                    <Form.Group controlId="file-input" className="mb-3">
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    {isUploading && <ProgressBar animated now={uploadProgress} label={`${Math.round(uploadProgress)}%`} className="mb-3" />}
                    <Button onClick={handleUpload} disabled={!selectedFile || isUploading} size="lg">
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                </Card>

                <h2>Your Files</h2>
                <hr />
                <Row xs={1} md={2} lg={4} className="g-4">
                    {files.length > 0 ? files.map(file => (
                        <Col key={file.id}>
                            <Card className="h-100 shadow-sm border-0 card-hover">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                                    {file.type.startsWith('image') ? (
                                        <Card.Img variant="top" src={file.url} style={{ height: '200px', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#e9ecef' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-file-earmark-text text-secondary" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                                        </div>
                                    )}
                                    <Card.Body>
                                        <Card.Title className="text-truncate" title={file.name}>{file.name}</Card.Title>
                                        <Card.Text className="text-muted small">
                                            {new Date(file.createdAt?.toDate()).toLocaleString()}
                                        </Card.Text>
                                    </Card.Body>
                                </a>
                            </Card>
                        </Col>
                    )) : (
                        <Col>
                            <Alert variant="info">You haven't uploaded any files yet. Use the form above to get started!</Alert>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default HomePage;