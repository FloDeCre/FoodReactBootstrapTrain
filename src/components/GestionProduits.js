import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import Navbar from './Navbar';

function GestionProduits() {
  const [productData, setProductData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    tva: 0,
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = () => {
    axios.get('http://localhost:3000/products/all')
      .then(response => {
        setProductData(response.data);
        console.log(productData)
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
        setProductData([]);
      });
  };

  const handleUpdateClick = (productId) => {
    setSelectedProductId(productId);
    const selectedProduct = productData.find(product => product.id === productId);
    setFormData({
      name: selectedProduct.name,
      price: selectedProduct.price,
      tva: selectedProduct.tva,
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const handleDeleteClick = (productId) => {
    axios.delete(`http://localhost:3000/products/delete/${productId}`)
      .then(response => {
        console.log(response.data);
        fetchProductData();
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProductId(null);
    setFormData({
      name: '',
      price: 0,
      tva: 0,
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
    axios.put(`http://localhost:3000/products/update/${selectedProductId}`, formData)
      .then(response => {
        console.log(response.data);
        handleModalClose();
        fetchProductData();
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  };

  return (
    <div>
          <Navbar />
      <h1>Gestion des Produits</h1>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>TVA</th>
            <th>Dernière mise à jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productData.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{`${product.price} euros TTC`}</td>
              <td>{product.tva}</td>
              <td>{new Date(product.updatedAt).toLocaleString()}</td>
              <td>
                <Button variant="info" onClick={() => handleUpdateClick(product.id)}>Mettre à jour</Button>
                <Button variant="danger" onClick={() => handleDeleteClick(product.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" placeholder="Nom du produit" name="name" value={formData.name} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Prix</Form.Label>
              <Form.Control type="number" placeholder="Prix du produit" name="price" value={formData.price} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group controlId="formTva">
              <Form.Label>TVA</Form.Label>
              <Form.Control type="number" placeholder="TVA du produit" name="tva" value={formData.tva} onChange={handleFormChange} required />
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

export default GestionProduits;
