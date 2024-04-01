import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ProductTable from './components/ProductTable';
import ProductCreation from './components/ProductCreation';
import Historique from './components/Historique';
import GestionProduits from './components/GestionProduits';
import AchatCreation from './components/AchatCreation';
import AchatsTable from './components/AchatsTable';
import GestionAchats from './components/GestionAchat';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductTable/>
  },
  {
    path: "/create",
    element: <ProductCreation/>
  },
  {
    path: "/historique",
    element: <Historique/>
  },
  {
    path: "/gestion",
    element: <GestionProduits/>
  },
  {
    path: "/gestionAchats",
    element: <GestionAchats/>
  },
  {
    path: "/achat",
    element: <AchatCreation/>
  },
  {
    path: "/achatList",
    element: <AchatsTable/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);


reportWebVitals();
