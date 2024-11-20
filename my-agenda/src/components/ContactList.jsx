import './App.css';


const ContactList = ({ contacts }) => {
    return (
      <div className="contact-list">
        {contacts.map(contact => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
      </div>
    );
  };
  export default ContactList;