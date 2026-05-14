import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://aicostcalculator.dev';
const siteName = 'AI Cost Calculator';
const siteDescription = 'Calculate the cost of using AI APIs for your projects';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-8935274984783226"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  
  !b:	
  );
}
