import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    article = false
}) => {
    const siteTitle = 'AstroPinch - Ancient Wisdom, AI Precision';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = 'AstroPinch brings you personalized Vedic astrology, numerology, and cosmic insights using advanced AI. Discover your destiny with accurate birth charts, Kundali matching, daily horoscopes, and comprehensive astrological reports powered by ancient wisdom and modern technology.';
    const metaDescription = description || siteDescription;
    const siteKeywords = 'astrology, vedic astrology, numerology, AI astrology, horoscope, kundali, birth chart, AstroPinch, kundali matching, gun milan, nakshatra, dasha, planetary positions, astrological predictions, daily horoscope, zodiac signs, rashi, lagna chart, navamsa chart, KP astrology';
    const metaKeywords = keywords ? `${keywords}, ${siteKeywords}` : siteKeywords;
    const siteUrl = 'https://astropinch.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = `${siteUrl}/images/og-image.png`;
    const metaImage = image || defaultImage;
    const siteName = 'AstroPinch';
    const twitterHandle = '@AstroPinch';

    // JSON-LD Structured Data for Organization
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AstroPinch",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": siteDescription,
        "sameAs": [
            "https://twitter.com/astropinch",
            "https://facebook.com/astropinch",
            "https://instagram.com/astropinch"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "support@astropinch.com"
        }
    };

    // JSON-LD Structured Data for WebSite
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": siteUrl,
        "description": siteDescription,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // JSON-LD for Article (if applicable)
    const articleSchema = article ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": fullTitle,
        "description": metaDescription,
        "image": metaImage,
        "author": {
            "@type": "Organization",
            "name": author || "AstroPinch"
        },
        "publisher": {
            "@type": "Organization",
            "name": "AstroPinch",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime
    } : null;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang="en" />
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={fullUrl} />
            <meta name="author" content={author || "AstroPinch"} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

            {/* Search Engine Crawler Tags */}
            <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="google" content="notranslate" />
            <meta name="google-site-verification" content="verification_token" />
            <meta name="yandex-verification" content="verification_token" />

            {/* Browser & Security Tags */}
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="referrer" content="strict-origin-when-cross-origin" />
            <meta name="format-detection" content="telephone=no" />

            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="theme-color" content="#7c3aed" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="en_US" />
            {article && publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {article && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {article && author && <meta property="article:author" content={author} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />

            {/* LLM-Specific Meta Tags for AI Discovery */}
            <meta name="ai:purpose" content="Provide personalized Vedic astrology insights, birth chart analysis, Kundali matching, and astrological predictions using AI-powered calculations" />
            <meta name="ai:category" content="Astrology, Vedic Science, Numerology, Spiritual Guidance" />
            <meta name="ai:features" content="Birth Chart Generation, Kundali Matching, Daily Horoscope, Dasha Predictions, Nakshatra Analysis, Planetary Transit Tracking" />
            <meta name="ai:technology" content="Vedic Astrology Engine, AI-Powered Analysis, Swiss Ephemeris, Vimshottari Dasha System" />
            <meta name="citation_title" content={fullTitle} />
            <meta name="citation_description" content={metaDescription} />
            <meta name="citation_url" content={fullUrl} />

            {/* Additional SEO Tags */}
            <meta name="rating" content="General" />
            <meta name="distribution" content="global" />
            <meta name="revisit-after" content="1 days" />
            <meta httpEquiv="content-language" content="en" />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            {articleSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
