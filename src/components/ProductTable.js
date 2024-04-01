import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Navbar from './Navbar';
import { Card } from 'react-bootstrap';
import '../style/productHome.css';

function ProductTable() {
    const [dateJour, setDateJour] = useState(new Date());
    const [productData, setProductData] = useState([]);
    const [productQuantities, setProductQuantities] = useState({});
    const [caisseQuantities, setCaisseQuantities] = useState({});
    const [montantClient, setMontantClient] = useState(0);
    const day = dateJour.getDate();
    const month = dateJour.getMonth() + 1;
    const year = dateJour.getFullYear();

    useEffect(() => {
        axios.get('http://localhost:3000/products/all')
            .then(response => {
                console.log('Produits:', response.data)
                setProductData(response.data);
                const initialQuantities = {};
                response.data.forEach(product => {
                    initialQuantities[product.id] = 0;
                });
                console.log('OriginalInitialQuantities', initialQuantities)
                setProductQuantities(initialQuantities);
                const initialCaisseQuantities = {};
                productData.forEach(product => {
                    initialCaisseQuantities[product.id] = 0;
                });
                setCaisseQuantities(initialCaisseQuantities);
            })
            .catch(error => {
                console.error('Erreur de requête :', error);
                setProductData([]);
            });
    }, []);

    const handleIncrement = (productId) => {
        setProductQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: prevQuantities[productId] + 1,
        }));
    };

    const handleDecrement = (productId) => {
        if (productQuantities[productId] > 0) {
            setProductQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: prevQuantities[productId] - 1,
            }));
        }
    };

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        productData.forEach(product => {
            totalAmount += product.price * productQuantities[product.id];
        });
        return totalAmount.toFixed(2);
    };

    const calculateTotalQuantity = () => {
        let totalQuantity = 0;
        productData.forEach(product => {
            totalQuantity += productQuantities[product.id];
        });
        return totalQuantity;
    };

    const handleIncrementCaisse = (productId) => {
        setCaisseQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
        }));
    };

    const handleDecrementCaisse = (productId) => {
        if (caisseQuantities[productId] > 0) {
            setCaisseQuantities((prevQuantities) => ({
                ...prevQuantities,
                [productId]: prevQuantities[productId] - 1,
            }));
        }
    };

    const handleIncrementAndCaisse = (productId) => {
        handleIncrement(productId);
        handleIncrementCaisse(productId);
    };
    const handleDecrementAndCaisse=(productId)=>{
        handleDecrementCaisse(productId);
        handleDecrement(productId);
    }

    const calculateTotalCaisseAmount = () => {
        let totalCaisseAmount = 0;
        productData.forEach(product => {
            totalCaisseAmount += product.price * caisseQuantities[product.id];
        });
        return totalCaisseAmount.toFixed(2);
    };

    const calculateTotalCaisseMonnaie = () => {
        const montantDonne = montantClient || 0;
        const montantTotalCaisse = parseFloat(calculateTotalCaisseAmount());
        const monnaieArendre = montantDonne - montantTotalCaisse;
        return monnaieArendre.toFixed(2);
    };

    const calculateTotalCaisseQuantity = () => {
        let totalCaisseQuantity = 0;
        productData.forEach(product => {
            totalCaisseQuantity += caisseQuantities[product.id];
        });
        return totalCaisseQuantity;
    };

    const loadDay = () => {
        const currentDate = {
            year: year,
            month: month,
            day: day,
        };
        console.log(currentDate)
        axios.get('http://localhost:3000/ventes/all')
            .then(response => {
                const ventesData = response.data || [];
                console.log('ventesData:', ventesData)
                const salesForDay = ventesData.filter(sale =>
                    sale.date &&
                    sale.date.year === currentDate.year &&
                    sale.date.month === currentDate.month &&
                    sale.date.day === currentDate.day
                );
                console.log('salesForDay:', salesForDay)

                if (salesForDay.length > 0) {
                    console.log('Ventes pour la journée :', salesForDay[0].products);
                    setProductData(salesForDay[0].products);
                    const initialQuantities = {};
                    salesForDay[0].products.forEach(product => {
                        console.log(product.name, product.quantity)
                        initialQuantities[product.id] = product.quantity;
                    });
                    console.log("initialQuantities", initialQuantities)
                    setProductQuantities(initialQuantities);
                } else {
                    console.log('Pas de vente dans la journée pour la date spécifiée.');
                }
            })
            .catch(error => {
                console.error('Erreur de requête pour les ventes du jour :', error);
                setProductData([]);
            });
    };

    const saveDay = () => {
        const productsToSave = productData.filter(product => productQuantities[product.id] > 0);

        const dataToSave = {
            date: {
                year: year,
                month: month,
                day: day,
            },
            products: productsToSave.map(product => ({
                name: product.name,
                id: product.id,
                price: product.price,
                quantity: productQuantities[product.id],
            })),
            totalAmount: parseFloat(calculateTotalAmount()),
            totalQuantity: calculateTotalQuantity(),
        };

        axios.post('http://localhost:3000/ventes/create', dataToSave)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Erreur de requête :', error);
            });
    };

    const validerVente = () => {
        
        setMontantClient(0);
        const initialCaisseQuantities = {};
        productData.forEach(product => {
            initialCaisseQuantities[product.id] = 0;
        });
        setCaisseQuantities(initialCaisseQuantities);
    };

    return (
        <section>
            <div>
                <Navbar />
            </div>
            <div className="center-container">
                <h1>Vente du jour</h1>
                <p className='DateClass'>{`${day}/${month}/${year}`}</p>
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
                                {productData.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{`${product.price} euros TTC`}</td>
                                        <td>
                                            <Button onClick={() => handleIncrement(product.id)}>+</Button>
                                            <Button onClick={() => handleDecrement(product.id)}>-</Button>
                                        </td>
                                        <td>{productQuantities[product.id]}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="TableFootClass" colSpan={1}>
                                        Montant encaissé: {calculateTotalAmount()} euros TTC
                                    </td>
                                    <td className="TableFootClass" colSpan={4}>
                                        Quantité totale: {calculateTotalQuantity()} unité(s)
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                        <Button onClick={saveDay}>Sauvegarder la journée</Button>
                        <Button onClick={loadDay}>Charger la journée</Button>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <h2>Caisse Enregistreuse</h2>
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
                                {productData.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{`${product.price} euros TTC`}</td>
                                        <td>
                                            <Button onClick={() => handleIncrementAndCaisse(product.id)}>+</Button>
                                            <Button onClick={() => handleDecrementAndCaisse(product.id)}>-</Button>
                                        </td>
                                        <td>{caisseQuantities[product.id]}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="TableFootClass" colSpan={1}>
                                        Montant total: {calculateTotalCaisseAmount()} euros TTC
                                    </td>
                                    <td className="TableFootClass" colSpan={1}>
                                        <input
                                            type="number"
                                            placeholder="Montant donné par le client"
                                            value={montantClient}
                                            onChange={(e) => setMontantClient(parseFloat(e.target.value))}
                                        />
                                    </td>
                                    <td className="TableFootClass" colSpan={1}>
                                        Monnaie à rendre: {calculateTotalCaisseMonnaie()} euros TTC
                                    </td>
                                    <td className="TableFootClass" colSpan={4}>
                                        Quantité totale: {calculateTotalCaisseQuantity()} unité(s)
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                        <Button onClick={validerVente}>Valider la vente</Button>
                    </Card.Body>
                </Card>
            </div>
        </section>
    );
}

export default ProductTable;
