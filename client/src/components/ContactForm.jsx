import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './../css/contact.css'; // Assuming you have a corresponding CSS file for styling

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    country: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailData = { ...formData };

    sendFormData(emailData);
  };

  const sendFormData = (data) => {
    const templateParams = {
      name: data.name,
      surname: data.surname,
      country: data.country,
      email: data.email,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      message: data.message
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Mesazhi u dërgua me sukses!');
      }, (err) => {
        console.error('FAILED...', err);
        alert('Problem i përkohshëm. Provo përsëri më vonë!');
      });
  };

  return (
    <section data-aos="fade-up"  className="container contact-form-section">
      <form className="container contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Emri"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Mbiemri"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="country"
            placeholder="Shteti"
            value={formData.country}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Telefon"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Kompania"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <textarea
          name="message"
          placeholder="Mesazhi"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-secondary btn-submit-form">
          Dërgo
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
