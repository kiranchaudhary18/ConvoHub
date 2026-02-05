import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import RootLayoutClient from '@/components/RootLayoutClient';

export const metadata = {
  metadataBase: new URL('https://convohub.in'),
  title: {
    template: '%s | ConvoHub - Real-time Chat Application',
    default: 'ConvoHub - Real-time Chat Application for Instant Messaging',
  },
  description: 'ConvoHub is a premium real-time chat application for instant messaging, group conversations, and secure communication. Connect instantly with ConvoHub.',
  keywords: ['ConvoHub', 'real-time chat', 'instant messaging', 'group chat', 'secure messaging', 'chat application', 'online chat'],
  authors: [{ name: 'ConvoHub', url: 'https://convohub.in' }],
  creator: 'ConvoHub',
  publisher: 'ConvoHub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  canonical: 'https://convohub.in',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://convohub.in',
    title: 'ConvoHub - Real-time Chat Application',
    description: 'Premium real-time chat for instant messaging and group conversations',
    siteName: 'ConvoHub',
    images: [
      {
        url: 'https://convohub.in/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ConvoHub - Real-time Chat Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvoHub - Real-time Chat',
    description: 'Premium real-time chat application',
    images: ['https://convohub.in/opengraph-image.png'],
    creator: '@convohub',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://convohub.in',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'ConvoHub',
              alternateName: 'ConvoHub - Real-time Chat Application',
              description: 'Premium real-time chat and instant messaging application for seamless communication',
              applicationCategory: 'CommunicationApplication',
              operatingSystem: 'Web',
              url: 'https://convohub.in',
              image: 'https://convohub.in/opengraph-image.png',
              author: {
                '@type': 'Organization',
                name: 'ConvoHub',
                url: 'https://convohub.in',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1200',
              },
            }),
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <RootLayoutClient>
          <Toaster position="top-right" />
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
