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
    const [fileName, setFileName] = useState('');
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
        }, (error) => {
            console.error("Firestore error: ", error);
            toast.error("Could not load files. Please check security rules and indexes.");
        });
        return () => unsubscribe();
    }, [user]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) {
            toast.warn("Please select a file first.");
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            await addDoc(collection(db, "files"), {
                userId: user.uid,
                name: fileName || selectedFile.name,
                url: data.secure_url,
                type: selectedFile.type,
                createdAt: new Date(),
            });
            toast.success('File uploaded successfully!');
        } catch (error) {
            toast.error("File upload failed: " + error.message);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            setFileName('');
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
        return <div className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" variant="primary" /></div>;
    }
    
    if (user && !user.emailVerified) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
                <Card className="p-4 shadow-lg border-0" style={{ maxWidth: '500px' }}>
                    <Card.Body>
                        <Card.Title as="h2" className="mb-3">Verify Your Email</Card.Title>
                        <Card.Text>A verification link was sent to <strong>{user.email}</strong>.</Card.Text>
                        <Card.Text>Please check your inbox (and spam folder) to activate your account.</Card.Text>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                            <Button variant="primary" onClick={handleResendVerification}>Resend Email</Button>
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
    
    // ফাইল কার্ডের জন্য একটি Helper কম্পোনেন্ট
    const FilePreview = ({ file }) => {
        if (file.type.startsWith('image')) {
            return <Card.Img variant="top" src={file.url} style={{ height: '200px', objectFit: 'cover' }} />;
        }
        if (file.type.startsWith('video')) {
            return <video src={file.url} style={{ width: '100%', height: '200px', objectFit: 'cover' }} controls />;
        }
        if (file.type.includes('pdf')) {
            // PDF আইকন
            return <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#e9ecef' }}><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#D93025" className="bi bi-file-earmark-pdf-fill" viewBox="0 0 16 16"><path d="M5.523 12.424q.21-.164.455-.164.247 0 .45.164.205.164.317.437h.45a.532.532 0 0 0 .532-.532V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.375a.5.5 0 0 0 .5.5h.5v1.275a.5.5 0 0 0-.5.5h-1a.5.5 0 0 0-.5.5v1.a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V8.5h-1a.5.5 0 0 0-.5.5v1.125a.5.5 0 0 0 .5.5h.5v.918a.554.554 0 0 0 .554.554h.188a.554.554 0 0 0 .554-.554V11.5a.5.5 0 0 0-.5-.5h-.5v-1.275a.5.5 0 0 0 .5-.5h1a.5.5 0 0 0 .5.5v1.836a.532.532 0 0 0-.532.532h-.45a.554.554 0 0 0-.11-.193.437.437 0 0 0-.244-.135.437.437 0 0 0-.244.135q-.157.126-.157.377a.45.45 0 0 0 .157.377q.149.125.368.125.22 0 .368-.125.149-.126.149-.377h.45a.532.532 0 0 0 .532-.532V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.375a.5.5 0 0 0 .5.5h.5v1.275a.5.5 0 0 0-.5.5h-1a.5.5 0 0 0-.5.5v1.a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V8.5h-1a.5.5 0 0 0-.5.5v1.125a.5.5 0 0 0 .5.5h.5v.918a.554.554 0 0 0 .554.554h.188a.554.554 0 0 0 .554-.554V11.5a.5.5 0 0 0-.5-.5h-.5v-1.275a.5.5 0 0 0 .5-.5h1a.5.5 0 0 0 .5.5v1.836a.532.532 0 0 0-.532.532z"/><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1"/></svg></div>;
        }
        // জেনেরিক ফাইল আইকন
        return <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#e9ecef' }}><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-file-earmark-text text-secondary" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg></div>;
    };

    return (
        <div className="bg-light">
            <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
                <Container>
                    <Navbar.Brand href="#home" className="fw-bold fs-4">FileSafe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            {user && <Navbar.Text className="me-lg-3 mb-2 mb-lg-0">Signed in as: <strong>{user.email}</strong></Navbar.Text>}
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-4 my-md-5">
                <Card className="p-4 p-lg-5 mb-5 shadow-sm border-0 rounded-3">
                    <h2 className="mb-4">Upload New File</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Custom File Name (Optional)</Form.Label>
                        <Form.Control type="text" placeholder="e.g., My Semester Report" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="file-input" className="mb-3">
                        <Form.Label>Select File</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    {isUploading && <ProgressBar animated now={100} className="mb-3" />}
                    <div className="d-grid">
                        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} size="lg" variant="success">
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </div>
                </Card>

                <h2>Your Files</h2>
                <hr />
                {/* রেসপন্সিভ গ্রিড: ছোট স্ক্রিনে ১টি, মিডিয়ামে ২টি, লার্জে ৩টি এবং XL স্ক্রিনে ৪টি কার্ড */}
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {files.length > 0 ? files.map(file => (
                        <Col key={file.id}>
                            <Card className="h-100 shadow-sm border-0 card-hover">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                                    <FilePreview file={file} />
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
                        <Col xs={12}>
                            <Alert variant="info">You haven't uploaded any files yet. Use the form above to get started!</Alert>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};
export default HomePage;