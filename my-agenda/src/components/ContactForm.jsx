import './App.css';

const ContactForm = ({ onSubmit, onClose }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      const contactData = {
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        direccion: {
          calle: formData.get('calle'),
          numero: formData.get('numero'),
          ciudad: formData.get('ciudad'),
          codigo_postal: formData.get('codigo_postal')
        }
      };
  
      try {
        await fetch('http://localhost:3000/personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData)
        });
        
        onSubmit();
        onClose();
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <input type="text" name="nombre" placeholder="Nombre" required />
          <input type="text" name="apellido" placeholder="Apellido" required />
        </div>
        <div className="form-row">
          <input type="email" name="email" placeholder="Email" />
          <input type="tel" name="telefono" placeholder="Teléfono" />
        </div>
        <div className="form-row">
          <input type="text" name="calle" placeholder="Calle" />
          <input type="text" name="numero" placeholder="Número" />
        </div>
        <div className="form-row">
          <input type="text" name="ciudad" placeholder="Ciudad" />
          <input type="text" name="codigo_postal" placeholder="Código Postal" />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">✓</button>
          <button type="button" onClick={onClose} className="cancel-button">×</button>
        </div>
      </form>
    );
  };

  export default ContactForm;