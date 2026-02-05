// src/components/StructuredData.jsx

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ConvoHub',
    alternateName: 'ConvoHub - Real-time Chat Application',
    description: 'Premium real-time chat and instant messaging application for seamless communication',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web',
    url: 'https://convohub.in',
    image: 'https://convohub.in/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'ConvoHub',
      url: 'https://convohub.in',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    inLanguage: 'en',
    featureList: [
      'Real-time messaging',
      'Group chat support',
      'End-to-end encryption',
      'Mobile responsive',
      'Secure communication',
      'Instant notifications',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ConvoHub',
    url: 'https://convohub.in',
    logo: 'https://convohub.in/logo.png',
    description: 'Premium real-time chat application for instant messaging',
    sameAs: [
      'https://twitter.com/convohub',
      'https://facebook.com/convohub',
      'https://linkedin.com/company/convohub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      areaServed: 'US',
      availableLanguage: 'en',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ConvoHub?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ConvoHub is a premium real-time chat application for instant messaging and group conversations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is ConvoHub free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, ConvoHub is free to use. Simply register and start chatting.',
        },
      },
      {
        '@type': 'Question',
        name: 'How secure is ConvoHub?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ConvoHub uses end-to-end encryption to protect your conversations.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
