import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Card, Form, FloatingLabel, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import axios from 'axios';

function ProductCreation() {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productTVA, setProductTVA] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCreateProduct = () => {
        const currentDate = new Date();
        const newProduct = {
            id: 0,
            name: productName,
            price: parseFloat(productPrice),
            tva: parseFloat(productTVA),
            createdAt: currentDate,
            updatedAt: currentDate,
        };

        axios.post('http://localhost:3000/products/create', newProduct)
            .then(response => {
                console.log(response.data);
                setProductName('');
                setProductPrice('');
                setProductTVA('');
                setShowConfirmation(true);
                setTimeout(() => {
                    setShowConfirmation(false);
                }, 2000);
            })
            .catch(error => {
                console.error('Erreur de requête :', error);
            });
    };

    return (
        <section>
            <div>
                <Navbar />
            </div>
            <div>
                <Card>
                    <Card.Body>
                        <FloatingLabel controlId="floatingInput1" label="Nom du produit" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nom"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput2" label="Prix du produit" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Prix HT"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput3" label="TVA" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="TVA"
                                value={productTVA}
                                onChange={(e) => setProductTVA(e.target.value)}
                            />
                        </FloatingLabel>
                        <Button id="button" variant="primary" className="mr-2" onClick={handleCreateProduct}>
                            Créer
                        </Button>
                    </Card.Body>
                </Card>
                {/* Pop-up de confirmation */}
                {showConfirmation && (
                    <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
                        Produit créé avec succès !
                    </Alert>
                )}
            </div>
        </section>
    );
}

export default ProductCreation;
