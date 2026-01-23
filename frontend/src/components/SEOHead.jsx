
import React from 'react';
import { Helmet } from 'react-helmet';
import { generateOrganizationSchema, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo-utils';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage, 
  schemaType,
  schemaData 
}) => {
  const siteTitle = "Infinity X AI | Autonomous Enterprise Intelligence";
  const finalTitle = title ? `${title} | Infinity X` : siteTitle;
  const finalDesc = description || "The world's first autonomous business operating system. Scale operations, automate workflows, and predict market trends with neural intelligence.";
  const finalUrl = canonicalUrl || "https://infinityxai.com";

  let structuredData = [generateOrganizationSchema()];

  if (schemaType === 'product' && schemaData) {
    structuredData.push(generateProductSchema(schemaData.name, schemaData.description));
  }
  
  if (schemaType === 'breadcrumb' && schemaData) {
    structuredData.push(generateBreadcrumbSchema(schemaData));
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={keywords || "AI, Artificial Intelligence, Business Automation, Predictive Analytics, Enterprise AI, Autonomous Agents"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={ogImage || "https://infinityxai.com/og-image.jpg"} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDesc} />
      <meta property="twitter:image" content={ogImage || "https://infinityxai.com/og-image.jpg"} />
      
      {/* Canonical */}
      <link rel="canonical" href={finalUrl} />

      {/* Structured Data (JSON-LD) */}
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
