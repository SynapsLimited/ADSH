'use client'

import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import '@/css/privacypolicy.css';

interface PrivacyPolicyTranslations {
  title: string;
  sections: {
    introduction: {
      heading: string;
      paragraph: string;
    };
    informationCollected: {
      heading: string;
      paragraphs: string[]; // Array of strings
    };
    informationUse: {
      heading: string;
      paragraphs: string[]; // Array of strings
    };
    informationSharing: {
      heading: string;
      paragraphs: string[]; // Array of strings
    };
    cookies: {
      heading: string;
      paragraphs: string[]; // Array of strings
    };
    dataSecurity: {
      heading: string;
      paragraph: string;
    };
    userRights: {
      heading: string;
      paragraph: string;
    };
    policyChanges: {
      heading: string;
      paragraph: string;
    };
    contact: {
      heading: string;
      paragraph: string;
      list: { label: string; value: string }[]; // Array of objects
    };
  };
}

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  // Use type assertion to tell TypeScript the shape of the returned object
  const informationCollected = t('privacyPolicy.sections.informationCollected.paragraphs', {
    returnObjects: true,
  }) as string[];
  const informationUse = t('privacyPolicy.sections.informationUse.paragraphs', {
    returnObjects: true,
  }) as string[];
  const informationSharing = t('privacyPolicy.sections.informationSharing.paragraphs', {
    returnObjects: true,
  }) as string[];
  const contactList = t('privacyPolicy.sections.contact.list', {
    returnObjects: true,
  }) as { label: string; value: string }[];

  return (
    <div className="privacy-policy-container container">
      <Head>
        <title>{t('privacyPolicy.title')}</title>
      </Head>
      <h1>{t('privacyPolicy.title')}</h1>

      <section>
        <h2>{t('privacyPolicy.sections.introduction.heading')}</h2>
        <p>{t('privacyPolicy.sections.introduction.paragraph')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationCollected.heading')}</h2>
        <p>{informationCollected[0]}</p>
        <ul>
          {informationCollected.slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationUse.heading')}</h2>
        <p>{informationUse[0]}</p>
        <ul>
          {informationUse.slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.informationSharing.heading')}</h2>
        <p>{informationSharing[0]}</p>
        <ul>
          {informationSharing.slice(1).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.cookies.heading')}</h2>
        <p>{t('privacyPolicy.sections.cookies.paragraphs')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.dataSecurity.heading')}</h2>
        <p>{t('privacyPolicy.sections.dataSecurity.paragraph')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.userRights.heading')}</h2>
        <p>{t('privacyPolicy.sections.userRights.paragraph')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.policyChanges.heading')}</h2>
        <p>{t('privacyPolicy.sections.policyChanges.paragraph')}</p>
      </section>

      <section>
        <h2>{t('privacyPolicy.sections.contact.heading')}</h2>
        <p>{t('privacyPolicy.sections.contact.paragraph')}</p>
        <ul>
          {contactList.map((item, index) => (
            <li key={index}>
              <b>{item.label}</b>{' '}
              <a href={`mailto:${item.value}`}>{item.value}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;