import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, url, type = "website" }) => {
  const defaultTitle = "The New York Oracle - Professional Tarot Readings & Spiritual Guidance | Marina Smargiannakis";
  const defaultDescription = "Get professional tarot readings and spiritual guidance from The New York Oracle. Featured in Forbes and PopSugar. Express readings, live consultations, and mentorship available. Book your session today.";
  const defaultKeywords = "tarot reading, spiritual guidance, psychic reading, New York oracle, Marina Smargiannakis, express reading, live tarot, spiritual consultation, intuitive reading, professional psychic";
  const defaultImage = "https://thenewyorkoracle.com/hero.png";
  const defaultUrl = "https://thenewyorkoracle.com/";

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Marina Smargiannakis" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="The New York Oracle" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
};

export default SEO;
