import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalculAnnee = () => {
  const [tableauObjets, setVente] = useState();
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/ventes/all')
      .then(response => {
        const ventesFiltrees = anneeSelectionnee
          ? response.data.filter(vente => vente.date.year === anneeSelectionnee)
          : response.data;

        setVente(ventesFiltrees);
        console.log(ventesFiltrees);
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  }, [anneeSelectionnee]);

  const anneesDisponibles = [...new Set(tableauObjets?.map(objet => objet.date.year))] || [];

  const totalAmountParAnnee = tableauObjets ? tableauObjets.reduce((acc, objet) => {
    const { year, month } = objet.date;
    const cle = `${year}`;

    if (!acc[cle]) {
      acc[cle] = {
        totalAmount: 0,
        totalQuantity: 0,
        produits: {}
      };
    }

    acc[cle].totalAmount += objet.totalAmount;
    acc[cle].totalQuantity += objet.totalQuantity;

    objet.products.forEach(product => {
      if (!acc[cle].produits[product.name]) {
        acc[cle].produits[product.name] = 0;
      }

      acc[cle].produits[product.name] += product.quantity;
    });

    return acc;
  }, {}) : {};

  console.log(totalAmountParAnnee);

  return (
    <div>
      <h2>Vos encaissements par Année</h2>
      <label>Sélectionner l'année : </label>
      <select onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}>
        <option value="">Toutes les années</option>
        {anneesDisponibles.map(annee => (
          <option key={annee} value={annee}>{annee}</option>
        ))}
      </select>
      <ul>
        {Object.entries(totalAmountParAnnee).map(([annee, data]) => (
          <li key={annee}>
            {annee}: 
            <ul>
              <li>Montant total: {data.totalAmount} euros</li>
              <li>Quantité totale: {data.totalQuantity} unité(s)</li>
              <li>Quantité par produits:
                <ul>
                  {Object.entries(data.produits).map(([nomProduit, quantite]) => (
                    <li key={nomProduit}>{nomProduit}: {quantite} unité(s)</li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalculAnnee;
