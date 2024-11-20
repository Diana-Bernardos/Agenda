import React, { useState, useEffect } from 'react';
import SearchBar from './src/components/SearchBar';
import ContactList from './src/components/ContactList';
import ContactForm from './src/components/ContactForm';
import AlphabetIndex from './src/components/AlphabetIndex';

import './App.css';


function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  

 // App.js
 const fetchContacts = async () => {
  try {
    console.log('Intentando obtener contactos...');
    const response = await fetch(`http://localhost:3000/personas?v=${Date.now()}`);
    console.log('Respuesta:', response);
    const data = await response.json();
    console.log('Datos obtenidos:', data);
    setContacts(data);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
  }
};
useEffect(() => {
  fetchContacts();
}, []);

  const filteredContacts = contacts.filter(contact =>
    `${contact.nombre} ${contact.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('Contacts:', contacts);
console.log('Filtered Contacts:', filteredContacts);

  return (
    <div className="app-container">
      <div className="contacts-container">
        <h1>Contacts</h1>
        <SearchBar 
          onSearch={setSearchTerm} 
          onAddClick={() => setShowForm(true)} 
        />
        
        {showForm && (
          <ContactForm 
            onSubmit={fetchContacts} 
            onClose={() => setShowForm(false)} 
          />
        )}

        <div className="contacts-section">
          <h2>Recent</h2>
          <ContactList contacts={filteredContacts.slice(0, 3)} />
        </div>

        <div className="contacts-section">
          <h2>All</h2>
          <ContactList contacts={filteredContacts} />
        </div>
      </div>
      <AlphabetIndex />
    </div>
  );
}

export default App;