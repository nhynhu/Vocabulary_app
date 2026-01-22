import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AuthModal = ({ show, onHide, onLogin, featureName }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="text-center">
                <Modal.Title className="w-100 text-center">Login Required</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">

                    <h5>Please sign in to continue</h5>
                    <p className="text-muted">
                        You need to sign in to use <strong>{featureName}</strong> feature
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center gap-3">
                <Button
                    variant="primary"
                    onClick={onLogin}
                    style={{ minWidth: '100px' }}
                >
                    Sign In
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AuthModal;