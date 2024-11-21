
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListaPersonas from './components/ListaPersonas';
import PersonaForm from './components/PersonaForm';
import ListaColecciones from './components/ListaColecciones';
import ColeccionForm from './components/ColeccionForm';
import DetalleColeccion from './components/DetalleColeccion';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>Agenda de Contactos</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Personas</Link>
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

        <footer className="footer">
          <p>© 2024 Agenda de Contactos</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;