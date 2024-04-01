import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Navbar from './Navbar';
import { Card } from 'react-bootstrap';
import '../style/productHome.css';

function AchatsTable() {
  const [dateJour, setDateJour] = useState(new Date());
  const [achatsData, setAchatsData] = useState([]);
  const [achatQuantities, setAchatQuantities] = useState({});
  const day = dateJour.getDate();
  const month = dateJour.getMonth() + 1;
  const year = dateJour.getFullYear();

  useEffect(() => {
    axios.get('http://localhost:3000/achat/all')
      .then(response => {
        setAchatsData(response.data);
        const initialQuantities = {};
        response.data.forEach(achat => {
          initialQuantities[achat.id] = 0;
        });
        setAchatQuantities(initialQuantities);
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
        setAchatsData([]);
      });
  }, []);

  const handleIncrement = (achatId) => {
    setAchatQuantities(prevQuantities => ({
      ...prevQuantities,
      [achatId]: prevQuantities[achatId] + 1,
    }));
  };

  const handleDecrement = (achatId) => {
    if (achatQuantities[achatId] > 0) {
      setAchatQuantities(prevQuantities => ({
        ...prevQuantities,
        [achatId]: prevQuantities[achatId] - 1,
      }));
    }
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    achatsData.forEach(achat => {
      totalAmount += achat.price * achatQuantities[achat.id];
    });
    return totalAmount.toFixed(2);
  };

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    achatsData.forEach(achat => {
      totalQuantity += achatQuantities[achat.id];
    });
    return totalQuantity;
  };

  const saveAchats = () => {
    const achatsToSave = achatsData.filter(achat => achatQuantities[achat.id] > 0);

    const dataToSave = {
      date: {
        year: year,
        month: month,
        day: day,
      },
      achat: achatsToSave.map(achat => ({
        name: achat.name,
        quantity: achatQuantities[achat.id],
      })),
      totalAmount: parseFloat(calculateTotalAmount()),
      totalQuantity: calculateTotalQuantity(),
    };

    axios.post('http://localhost:3000/achats/create', dataToSave)
      .then(response => {
        console.log(response.data);
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
      <div className="center-container">
        <h1>Liste d'achats</h1>
        <Card>
          <Card.Body>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>+/-</th>
                  <th>Quantité</th>
                </tr>
              </thead>
              <tbody>
                {achatsData.map(achat => (
                  <tr key={achat.id}>
                    <td>{achat.id}</td>
                    <td>{achat.name}</td>
                    <td>{`${achat.price} euros TTC`}</td>
                    <td>
                      <Button onClick={() => handleIncrement(achat.id)}>+</Button>
                      <Button onClick={() => handleDecrement(achat.id)}>-</Button>
                    </td>
                    <td>{achatQuantities[achat.id]}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="TableFootClass" colSpan={1}>
                    Montant total: {calculateTotalAmount()} euros TTC
                  </td>
                  <td className="TableFootClass" colSpan={4}>
                    Quantité totale: {calculateTotalQuantity()} unité(s)
                  </td>
                </tr>
              </tfoot>
            </Table>
            <Button onClick={saveAchats}>Sauvegarder la liste</Button>
          </Card.Body>
        </Card>
      </div>
    </section>
  );
}

export default AchatsTable;