'use client';

import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '@/css/contact.css';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  surname: string;
  country: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    country: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailData = { ...formData };
    sendFormData(emailData);
  };

  const sendFormData = (data: FormData) => {
    const templateParams = {
      name: data.name,
      surname: data.surname,
      country: data.country,
      email: data.email,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      message: data.message,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || '',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID || ''
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          alert(t('contactForm.successMessage'));
        },
        (err) => {
          console.error('FAILED...', err);
          alert(t('contactForm.errorMessage'));
        }
      );
  };

  return (
    <section data-aos="fade-up" className="container contact-form-section">
      <form className="container contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder={t('contactForm.name')}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder={t('contactForm.surname')}
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="country"
            placeholder={t('contactForm.country')}
            value={formData.country}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t('contactForm.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="phoneNumber"
            placeholder={t('contactForm.phoneNumber')}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder={t('contactForm.companyName')}
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <textarea
          name="message"
          placeholder={t('contactForm.message')}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-secondary btn-submit-form">
          {t('contactForm.send')}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;