import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalculMois = () => {
  const [tableauObjets, setVente] = useState();
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/ventes/all')
      .then(response => {
        // Filtrer les données par l'année sélectionnée (si elle est définie)
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

  const totalAmountParMoisAnnee = tableauObjets ? tableauObjets.reduce((acc, objet) => {
    const { year, month } = objet.date;
    const cle = `${year}-${month}`;

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


  console.log(totalAmountParMoisAnnee);

  return (
    <div>
      <h2>Vos encaissements par Mois et Année</h2>
      <label>Sélectionner l'année : </label>
      <select onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}>
        <option value="">Toutes les années</option>
        {anneesDisponibles.map(annee => (
          <option key={annee} value={annee}>{annee}</option>
        ))}
      </select>
      <ul>
        {Object.entries(totalAmountParMoisAnnee).map(([moisAnnee, data]) => (
          <li key={moisAnnee}>
            {moisAnnee}:
            <ul>
              <li>Montant total des ventes(CA): {data.totalAmount} euros</li>
              <li>Quantité totale vendue: {data.totalQuantity} unité(s)</li>
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

export default CalculMois;
