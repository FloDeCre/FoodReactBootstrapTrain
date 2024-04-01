import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BilanCompte = () => {
    const [tableauAchat, setAchat] = useState([]);
    const [tableauObjets, setVente] = useState([]);
    const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
    const [tableauObjetsAnnee, setVenteAnnee] = useState([]);
    const [tableauAchatsAnnee, setAchatsAnnee] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:3000/achats/all')
            .then(response => {
                const achatsFiltrees = anneeSelectionnee
                    ? response.data.filter(achat => achat.date.year === anneeSelectionnee)
                    : response.data;

                setAchat(achatsFiltrees);
                setAchatsAnnee(achatsFiltrees);
            })
            .catch(error => {
                console.error('Erreur de requête pour les achats :', error);
            });
    }, [anneeSelectionnee]);

    useEffect(() => {
        axios.get('http://localhost:3000/ventes/all')
            .then(response => {
                const ventesFiltrees = anneeSelectionnee
                    ? response.data.filter(vente => vente.date.year === anneeSelectionnee)
                    : response.data;

                setVente(ventesFiltrees);
                setVenteAnnee(ventesFiltrees);
            })
            .catch(error => {
                console.error('Erreur de requête pour les ventes :', error);
            });
    }, [anneeSelectionnee]);

    const anneesDisponibles = Array.from(
        new Set([...tableauObjets.map(objet => objet.date.year), ...tableauAchat.map(objet => objet.date.year), ...tableauObjetsAnnee.map(objet => objet.date.year), ...tableauAchatsAnnee.map(objet => objet.date.year)])
    );

    const totalAmountAchatParMoisAnnee = tableauAchat.reduce((acc, objet) => {
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
    }, {});

    const totalAmountParMoisAnnee = tableauObjets.reduce((acc, objet) => {
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
    }, {});

    const totalAmountVenteParAnnee = tableauObjetsAnnee ? tableauObjetsAnnee.reduce((acc, objet) => {
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
    const totalAmountAchatParAnnee = tableauAchatsAnnee ? tableauAchatsAnnee.reduce((acc, objet) => {
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


    return (
        <div>
            <h2>Bilan</h2>
            <label>Sélectionner l'année : </label>
            <select onChange={(e) => setAnneeSelectionnee(parseInt(e.target.value))}>
                <option value="">Toutes les années</option>
                {anneesDisponibles.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                ))}
            </select>
            <p>
                Par mois : 
            </p>
            <ul>
                {Object.entries(totalAmountParMoisAnnee).map(([moisAnnee, data]) => (
                    <li key={moisAnnee}>
                        {moisAnnee}
                        <ul>
                            {totalAmountAchatParMoisAnnee[moisAnnee] && (
                                <li>
                                    <ul>
                                        <li>Bilan(CA): {(data.totalAmount) - (totalAmountAchatParMoisAnnee[moisAnnee].totalAmount)} euros</li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </li>
                ))}
            </ul>
            <p>
                Par année :
            </p>
            <ul>
                {Object.entries(totalAmountVenteParAnnee).map(([Annee, data]) => (
                    <li key={Annee}>
                        {Annee}
                        <ul>
                            {totalAmountAchatParAnnee[Annee] && (
                                <li>
                                    <ul>
                                        <li>Bilan(CA): {(data.totalAmount) - (totalAmountAchatParAnnee[Annee].totalAmount)} euros</li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BilanCompte;
