import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Card } from 'react-bootstrap';
import Navbar from './Navbar';
import axios from 'axios';
import CalculMois from './CalculMois';
import CalculMoisAchats from './CalculMoisAchats';
import CalculAnnee from './CalculAnnee';
import CalculAnneeAchats from './CalculAnneeAchats';
import BilanCompte from './Bilan.js';

function Historique() {
  const [ventes, setVente] = useState();
  const [calculMoisVisible, setCalculMoisVisible] = useState(false);
  const [calculMoisAchatsVisible, setCalculMoisAchatsVisible] = useState(false);
  const [calculAnneeVisible, setCalculAnneeVisible] = useState(false);
  const [calculAnneeAchatsVisible, setCalculAnneeAchatsVisible] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/ventes/all')
      .then(response => {
        setVente(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  }, []);

  const toggleCalculMoisVisibility = () => {
    setCalculMoisVisible(!calculMoisVisible);
  };
  const toggleCalculMoisAchatsVisibility = () => {
    setCalculMoisAchatsVisible(!calculMoisAchatsVisible);
  };
  const toggleCalculAnneeVisibility = () => {
    setCalculAnneeVisible(!calculAnneeVisible);
  };
  const toggleCalculAnneeAchatsVisibility = () => {
    setCalculAnneeAchatsVisible(!calculAnneeAchatsVisible);
  };

  return (
    <section>
      <div>
        <Navbar />
      </div>
      <div>
        <Card>
          <Card.Body>
            <Button onClick={toggleCalculMoisVisibility}>
              {calculMoisVisible ? 'Fermer les ventes par mois' : 'Afficher les ventes par mois'}
            </Button>
            {calculMoisVisible && <CalculMois />}
          </Card.Body>
          <Card.Body>
            <Button variant="info" onClick={toggleCalculMoisAchatsVisibility}>
              {calculMoisAchatsVisible ? 'Fermer les achats par mois' : 'Afficher les achats par mois'}
            </Button>
            {calculMoisAchatsVisible && <CalculMoisAchats />}
          </Card.Body>
          <Card.Body>
            <Button onClick={toggleCalculAnneeVisibility}>
              {calculAnneeVisible ? 'Fermer les ventes par année' : 'Afficher les ventes par année'}
            </Button>
            {calculAnneeVisible && <CalculAnnee />}
          </Card.Body>
          <Card.Body>
            <Button variant="info" onClick={toggleCalculAnneeAchatsVisibility}>
              {calculAnneeAchatsVisible ? 'Fermer les achats par année' : 'Afficher les achats par année'}
            </Button>
            {calculAnneeAchatsVisible && <CalculAnneeAchats />}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <BilanCompte />
          </Card.Body>
        </Card>
      </div>
    </section>
  );
}

export default Historique;
