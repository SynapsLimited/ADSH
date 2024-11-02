// src/components/PrivacyPolicy.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import './../css/privacypolicy.css'

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-container container">
      <h1>{t('privacyPolicy.title')}</h1>

      <section>
        <h2>{t('privacyPolicy.sections.introduction.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.introduction.paragraph')}
        </p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationCollected.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.informationCollected.paragraphs[0]')}
        </p>
        <ul>
          {t('privacyPolicy.sections.informationCollected.paragraphs').slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationUse.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.informationUse.paragraphs[0]')}
        </p>
        <ul>
          {t('privacyPolicy.sections.informationUse.paragraphs').slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationSharing.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.informationSharing.paragraphs[0]')}
        </p>
        <ul>
          {t('privacyPolicy.sections.informationSharing.paragraphs').slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.cookies.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.cookies.paragraphs[0]')}
        </p>
        <p>
          {t('privacyPolicy.sections.cookies.paragraphs[1]')}
        </p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.dataSecurity.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.dataSecurity.paragraph')}
        </p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.userRights.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.userRights.paragraph')}
        </p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.policyChanges.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.policyChanges.paragraph')}
        </p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.contact.heading')}</h2>
        <p>
          {t('privacyPolicy.sections.contact.paragraph')}
        </p>
        <ul>
          {t('privacyPolicy.sections.contact.list').map((item, index) => (
            <li key={index}>
              <b>{item.label}</b> <a href={`mailto:${item.value}`}>{item.value}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
