import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalculMoisAchats = () => {
    const [tableauAchat, setAchat] = useState();
    const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/achats/all')
            .then(response => {
                const achatsFiltrees = anneeSelectionnee
                    ? response.data.filter(achat => achat.date.year === anneeSelectionnee)
                    : response.data;

                setAchat(achatsFiltrees);
                console.log(achatsFiltrees);
            })
            .catch(error => {
                console.error('Erreur de requête :', error);
            });
    }, [anneeSelectionnee]);


    const anneesDisponiblesAchats = [...new Set(tableauAchat?.map(objet => objet.date.year))] || [];


    const totalAmountAchatParMoisAnnee = tableauAchat ? tableauAchat.reduce((acc, objet) => {
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

        objet.achat.forEach(achat => {
            if (!acc[cle].produits[achat.name]) {
                acc[cle].produits[achat.name] = 0;
            }

            acc[cle].produits[achat.name] += achat.quantity;
        });

        return acc;
    }, {}) : {};

    console.log(totalAmountAchatParMoisAnnee);

    return (
        <div>
            <h2>Vos dépenses par Mois et Année</h2>
            <label>Sélectionner l'année : </label>
            <select onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}>
                <option value="">Toutes les années</option>
                {anneesDisponiblesAchats.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                ))}
            </select>
            <ul>
                {Object.entries(totalAmountAchatParMoisAnnee).map(([moisAnnee, data]) => (
                    <li key={moisAnnee}>
                        {'Achats en ' + moisAnnee}:
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

export default CalculMoisAchats;
