import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import Navbar from './Navbar';

function GestionAchats() {
  const [achatData, setAchatData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAchatId, setSelectedAchatId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tva: 0,
    price: 0,
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchAchatData();
  }, []);

  const fetchAchatData = () => {
    axios.get('http://localhost:3000/achat/all')
      .then(response => {
        setAchatData(response.data);
        console.log(achatData);
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
        setAchatData([]);
      });
  };

  const handleUpdateClick = (achatId) => {
    setSelectedAchatId(achatId);
    const selectedAchat = achatData.find(achat => achat.id === achatId);
    setFormData({
      name: selectedAchat.name,
      price: selectedAchat.price,
      tva: selectedAchat.tva,
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const handleDeleteClick = (achatId) => {
    axios.delete(`http://localhost:3000/achat/delete/${achatId}`)
      .then(response => {
        console.log(response.data);
        fetchAchatData();
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAchatId(null);
    setFormData({
      name: '',
      tva: 0,
      price: 0,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/achat/update/${selectedAchatId}`, formData)
      .then(response => {
        console.log(response.data);
        handleModalClose();
        fetchAchatData();
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  };

  return (
    <div>
      <Navbar />
      <h1>Gestion des Achats</h1>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom du Produit</th>
            <th>TVA</th>
            <th>Prix</th>
            <th>Dernière mise à jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achatData.map(achat => (
            <tr key={achat.id}>
              <td>{achat.id}</td>
              <td>{achat.name}</td>
              <td>{achat.tva}</td>
              <td>{`${achat.price} euros TTC`}</td>
              <td>{new Date(achat.updatedAt).toLocaleString()}</td>
              <td>
                <Button variant="info" onClick={() => handleUpdateClick(achat.id)}>Mettre à jour</Button>
                <Button variant="danger" onClick={() => handleDeleteClick(achat.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'Achat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Produit</Form.Label>
              <Form.Control type="text" placeholder="Nom du produit" name="name" value={formData.name} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Prix</Form.Label>
              <Form.Control type="number" placeholder="Prix" name="price" value={formData.price} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group controlId="formTVA">
              <Form.Label>TVA</Form.Label>
              <Form.Control type="number" placeholder="TVA" name="tva" value={formData.tva} onChange={handleFormChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default GestionAchats;
