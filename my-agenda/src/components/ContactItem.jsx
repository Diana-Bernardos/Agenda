import './App.css';


const ContactItem = ({ contact }) => {
    return (
      <div className="contact-item">
        <div className="contact-avatar">
          {contact.nombre[0]}
        </div>
        <div className="contact-info">
          {contact.nombre} {contact.apellido}
        </div>
      </div>
    );
  };

  export default ContactItem;