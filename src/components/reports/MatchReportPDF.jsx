import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

// Simple & Beautiful / Minimalist Design
const styles = {
    // Page: Clean white canvas with generous padding
    page: {
        padding: '60px',
        background: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#1a202c',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative'
    },

    // Header: Minimal text-only or icon branding
    header: {
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '30px'
    },
    brand: {
        fontSize: '12px',
        letterSpacing: '3px',
        color: '#a0aec0',
        textTransform: 'uppercase',
        marginBottom: '15px',
        fontWeight: '600'
    },
    mainTitle: {
        fontSize: '28px',
        fontWeight: '300', // Light/Elegant weight
        color: '#2d3748',
        marginBottom: '8px',
        letterSpacing: '-0.5px'
    },

    // Profiles: Clean separate columns
    profilesContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '50px',
        padding: '0 40px'
    },
    profileCol: {
        textAlign: 'center',
        flex: 1
    },
    profileLabel: {
        fontSize: '11px',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '8px'
    },
    profileName: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#2d3748',
        margin: 0
    },

    // Central Score
    scoreSection: {
        textAlign: 'center',
        marginBottom: '50px',
        position: 'relative'
    },
    scoreCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: '4px solid #f3e8ff',
        margin: '0 auto 15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf5ff' // Very subtle purple tint
    },
    scoreValue: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#7e22ce',
        lineHeight: '1'
    },
    scoreMax: {
        fontSize: '12px',
        color: '#a0aec0'
    },
    summaryText: {
        fontSize: '16px',
        color: '#4a5568',
        fontWeight: '500'
    },

    // Section Titles
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '20px',
        borderLeft: '3px solid #7e22ce', // Subtle accent marker
        paddingLeft: '12px'
    },

    // Table: Clean stripes removed, just borders
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        marginBottom: '50px'
    },
    th: {
        textAlign: 'left',
        padding: '12px 0 12px 10px',
        color: '#718096',
        fontWeight: '600',
        borderBottom: '2px solid #edf2f7',
        fontSize: '12px',
        textTransform: 'uppercase'
    },
    td: {
        padding: '16px 10px',
        borderBottom: '1px solid #edf2f7',
        color: '#4a5568'
    },
    tdCenter: {
        textAlign: 'center',
        padding: '16px 10px',
        borderBottom: '1px solid #edf2f7',
        color: '#4a5568'
    },
    scoreGood: { color: '#38a169', fontWeight: '600' },
    scoreBad: { color: '#e53e3e', fontWeight: '600' },

    // Dosha Grid - Minimal
    doshaGrid: {
        display: 'flex',
        gap: '40px',
        marginBottom: '50px'
    },
    doshaCol: { flex: 1 },
    doshaItem: {
        background: '#f7fafc',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '10px',
        fontSize: '14px',
        color: '#4a5568'
    },
    doshaLabel: { fontWeight: '600', color: '#2d3748', display: 'block', marginBottom: '4px' },

    // AI Content - Editorial Style
    aiContent: {
        fontSize: '15px',
        lineHeight: '1.8',
        color: '#2d3748',
        textAlign: 'justify'
    },

    footer: {
        textAlign: 'center',
        marginTop: '60px',
        borderTop: '1px solid #edf2f7',
        paddingTop: '30px',
        color: '#cbd5e0',
        fontSize: '11px'
    }
};

const MatchReportPDF = forwardRef(({ matchResult, bride, groom }, ref) => {
    const { t } = useTranslation();

    if (!matchResult || !bride || !groom) return null;

    return (
        <div ref={ref} style={styles.page}>

            {/* Minimal Header */}
            <div style={styles.header}>
                <div style={styles.brand}>ASTROPINCH REPORT</div>
                <h1 style={styles.mainTitle}>{t('kundaliMatch.reportTitle', 'Vedic Compatibility')}</h1>
                <div style={{ fontSize: '12px', color: '#cbd5e0' }}>{new Date().toLocaleDateString()}</div>
            </div>

            {/* Profiles */}
            <div style={styles.profilesContainer}>
                <div style={styles.profileCol}>
                    <div style={styles.profileLabel}>{t('kundaliMatch.bride', 'Bride')}</div>
                    <div style={styles.profileName}>{bride.name}</div>
                </div>

                {/* Center Score */}
                <div style={styles.scoreSection}>
                    <div style={styles.scoreCircle}>
                        <span style={styles.scoreValue}>{matchResult.total_score}</span>
                        <span style={styles.scoreMax}>/ 36</span>
                    </div>
                    <div style={{ ...styles.summaryText, color: matchResult.total_score >= 18 ? '#38a169' : '#e53e3e' }}>
                        {matchResult.summary}
                    </div>
                </div>

                <div style={styles.profileCol}>
                    <div style={styles.profileLabel}>{t('kundaliMatch.groom', 'Groom')}</div>
                    <div style={styles.profileName}>{groom.name}</div>
                </div>
            </div>

            {/* Koota Table */}
            <div>
                <h3 style={styles.sectionTitle}>{t('kundaliMatch.ashtaKoota', 'Compatibility Breakdown')}</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>{t('kundaliMatch.area', 'Area')}</th>
                            <th style={styles.th}>{t('kundaliMatch.description', 'Significance')}</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>{t('kundaliMatch.points', 'Score')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchResult.koota_details?.map((k, i) => (
                            <tr key={i}>
                                <td style={{ ...styles.td, fontWeight: '500' }}>{k.name}</td>
                                <td style={styles.td}>{k.significance}</td>
                                <td style={styles.tdCenter}>
                                    <span style={k.points === 0 || (k.name === 'Nadi' && k.points === 0) ? styles.scoreBad : styles.scoreGood}>
                                        {k.points}
                                    </span>
                                    <span style={{ color: '#cbd5e0', fontSize: '11px' }}> / {k.max_points}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Dosha Analysis - Side by Side */}
            <div style={styles.doshaGrid}>
                <div style={styles.doshaCol}>
                    <h3 style={styles.sectionTitle}>{t('kundaliMatch.manglikAnalysis', 'Manglik Analysis')}</h3>
                    <div style={styles.doshaItem}>
                        <span style={styles.doshaLabel}>{t('kundaliMatch.bride', 'Bride')}</span>
                        {matchResult.bride?.manglik_status}
                    </div>
                    <div style={styles.doshaItem}>
                        <span style={styles.doshaLabel}>{t('kundaliMatch.groom', 'Groom')}</span>
                        {matchResult.groom?.manglik_status}
                    </div>
                </div>
                <div style={styles.doshaCol}>
                    <h3 style={styles.sectionTitle}>{t('kundaliMatch.doshaAnalysis', 'Other Doshas')}</h3>
                    {matchResult.doshas?.filter(d => d.is_present).length > 0 ? (
                        matchResult.doshas?.filter(d => d.is_present).map((d, i) => (
                            <div key={i} style={{ ...styles.doshaItem, background: '#fff5f5', color: '#c53030' }}>
                                <span style={{ fontWeight: '600' }}>{d.name}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.doshaItem}>
                            {t('kundaliMatch.noMajorDoshas', 'No major doshas found.')}
                        </div>
                    )}
                </div>
            </div>

            {/* Expert Analysis */}
            <div>
                <h3 style={styles.sectionTitle}>{t('kundaliMatch.expertAnalysis', 'Expert Analysis')}</h3>
                <div style={styles.aiContent}>
                    {matchResult.ai_analysis}
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                © {new Date().getFullYear()} AstroPinch
            </div>
        </div>
    );
});

export default MatchReportPDF;
