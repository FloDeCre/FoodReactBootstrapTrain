import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Card, Form, FloatingLabel, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import axios from 'axios';

function AchatCreation() {
  const [achatName, setAchatName] = useState('');
  const [achatPrice, setAchatPrice] = useState('');
  const [achatTVA, setAchatTVA] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCreateAchat = () => {
    const currentDate = new Date();
    const newAchat = {
      id: 0,
      name: achatName,
      price: parseFloat(achatPrice),
      tva: parseFloat(achatTVA),
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    axios.post('http://localhost:3000/achat/create', newAchat)
      .then(response => {
        console.log(response.data);
        setAchatName('');
        setAchatPrice('');
        setAchatTVA('');
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
            <FloatingLabel controlId="floatingInput1" label="Nom de l'achat" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nom"
                value={achatName}
                onChange={(e) => setAchatName(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput2" label="Montant de l'achat" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Montant"
                value={achatPrice}
                onChange={(e) => setAchatPrice(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput3" label="TVA" className="mb-3">
              <Form.Control
                type="text"
                placeholder="TVA"
                value={achatTVA}
                onChange={(e) => setAchatTVA(e.target.value)}
              />
            </FloatingLabel>
            <Button id="button" variant="primary" className="mr-2" onClick={handleCreateAchat}>
              Créer
            </Button>
          </Card.Body>
        </Card>
        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Achat créé avec succès !
          </Alert>
        )}
      </div>
    </section>
  );
}

export default AchatCreation;
