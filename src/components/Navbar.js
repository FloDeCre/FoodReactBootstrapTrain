import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../style/Navbar.css'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCreatedClick = () => {
        navigate("/create");
    }
    const handleAchatCreatedClick = () => {
        navigate("/achat");
    }
    const handleAchatListCreatedClick = () => {
        navigate("/achatList");
    }
    const handleHomeClick = () => {
        navigate("/");
    }
    const handleHistoriqueClick = () => {
        navigate("/historique");
    }
    const handleGestionClick = () => {
        navigate("/gestion");
    }
    const handleGestionAchatClick = () => {
        navigate("/gestionAchats");
    }

    return (
        <section className='NavClass'>
            <Button variant="primary" onClick={handleShow}>
                Navigation
            </Button>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Actions:</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div >
                        <Button id="ActionButton" onClick={handleHomeClick}>Ventes du jour</Button><br />
                        <Button variant="info" id="ActionButton" onClick={handleAchatListCreatedClick}>Faire des achats</Button><br />
                        <Button id="ActionButton" onClick={handleCreatedClick}>Créer un produit</Button><br />
                        <Button id="ActionButton"onClick={handleGestionClick}>Gérer les produits</Button><br />
                        <Button variant="info" id="ActionButton" onClick={handleAchatCreatedClick}>Créer un achat</Button><br />
                        <Button variant="info" id="ActionButton"onClick={handleGestionAchatClick}>Gérer les achats</Button><br />
                        <Button variant="danger" id="ActionButton" onClick={handleHistoriqueClick}>Historique des ventes</Button><br />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </section>
    );
}

export default Navbar;