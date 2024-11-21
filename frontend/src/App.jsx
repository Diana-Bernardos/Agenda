
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListaPersonas from './Components/ListaPersonas.jsx';
import PersonaForm from './Components/PersonaForm.jsx';
import ListaColecciones from './Components/ListaColecciones.jsx';
import ColeccionForm from './Components/ColeccionForm.jsx';
import DetalleColeccion from './Components/DetalleColeccion.jsx';
import './Styles/Layout.css';
import './Styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>Agenda de Contactos</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Contactos</Link>
              <Link to="/colecciones" className="nav-link">Colecciones</Link>
            </div>
          </div>
        </nav>

        <main className="main-container">
          <Routes>
            <Route path="/" element={<ListaPersonas />} />
            <Route path="/personas/nueva" element={<PersonaForm />} />
            <Route path="/personas/editar/:id" element={<PersonaForm />} />
            <Route path="/colecciones" element={<ListaColecciones />} />
            <Route path="/colecciones/nueva" element={<ColeccionForm />} />
            <Route path="/colecciones/:id" element={<DetalleColeccion />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;