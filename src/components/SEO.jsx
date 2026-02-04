import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = 'AstroPinch - Ancient Wisdom, AI Precision';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = 'AstroPinch brings you personalized Vedic astrology, numerology, and cosmic insights using advanced AI. Discover your destiny with AstroPinch.';
    const metaDescription = description || siteDescription;
    const siteKeywords = 'astrology, vedic astrology, numerology, AI astrology, horoscope, kundali, birth chart, AstroPinch';
    const metaKeywords = keywords ? `${keywords}, ${siteKeywords}` : siteKeywords;
    const siteUrl = 'https://astropinch.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = `${siteUrl}/images/og-image.png`;
    const metaImage = image || defaultImage;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />
        </Helmet>
    );
};

export default SEO;
