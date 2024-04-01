import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalculAnneeAchats = () => {
  const [tableauAchats, setAchats] = useState();
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/achats/all')
      .then(response => {
        const AchatsFiltrees = anneeSelectionnee
          ? response.data.filter(achat => achat.date.year === anneeSelectionnee)
          : response.data;

        setAchats(AchatsFiltrees);
        console.log(AchatsFiltrees);
      })
      .catch(error => {
        console.error('Erreur de requête :', error);
      });
  }, [anneeSelectionnee]);

  const anneesDisponibles = [...new Set(tableauAchats?.map(objet => objet.date.year))] || [];

  const totalAmountParAnnee = tableauAchats ? tableauAchats.reduce((acc, objet) => {
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

    objet.achat.forEach(achat => {
      if (!acc[cle].produits[achat.name]) {
        acc[cle].produits[achat.name] = 0;
      }

      acc[cle].produits[achat.name] += achat.quantity;
    });

    return acc;
  }, {}) : {};

  console.log(totalAmountParAnnee);

  return (
    <div>
      <h2>Vos achats par Année</h2>
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
            {'Achats en '+ annee}: 
            <ul>
              <li>Montant total des achats: {data.totalAmount} euros</li>
              <li>Quantité totale d'achat: {data.totalQuantity} unité(s)</li>
              <li>Quantité achetée par produits:
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

export default CalculAnneeAchats;
