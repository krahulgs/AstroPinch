import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

// Modern Premium Style for PDF Report
const styles = {
    // Page Layout
    page: {
        padding: '50px',
        background: '#ffffff',
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#334155',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box'
    },

    // Header Section
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '50px',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '25px'
    },
    brand: {
        fontSize: '26px',
        fontWeight: '900',
        color: '#4f46e5',
        letterSpacing: '-0.5px',
        textTransform: 'uppercase'
    },
    meta: {
        textAlign: 'right'
    },
    date: {
        fontSize: '12px',
        color: '#94a3b8',
        marginBottom: '4px'
    },
    reportId: {
        fontSize: '10px',
        color: '#cbd5e1',
        fontFamily: 'monospace'
    },

    // Main Title Area
    titleBox: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    mainTitle: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '8px',
        margin: 0
    },
    subTitle: {
        fontSize: '16px',
        color: '#64748b',
        maxWidth: '500px',
        margin: '0 auto'
    },

    // Hero Section (Profiles + Score)
    heroGrid: {
        display: 'flex',
        gap: '40px',
        marginBottom: '50px',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Profile Card
    profileCard: {
        flex: 1,
        padding: '30px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    roleLabel: {
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: '#64748b',
        marginBottom: '10px',
        fontWeight: '700'
    },
    name: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#1e293b',
        margin: 0,
        lineHeight: '1.3'
    },

    // Central Score
    scoreBox: {
        width: '160px',
        textAlign: 'center',
        flexShrink: 0
    },
    scoreRing: {
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        border: '12px solid #4f46e5', // Safe alternative to gradient
        margin: '0 auto 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    scoreVal: {
        fontSize: '48px',
        fontWeight: '900',
        color: '#4f46e5',
        lineHeight: '1',
        margin: 0
    },
    scoreMax: {
        fontSize: '14px',
        color: '#94a3b8',
        marginTop: '0px'
    },
    scoreLabel: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0
    },
    statusBadge: (score) => ({
        display: 'inline-block',
        marginTop: '8px',
        padding: '4px 12px',
        borderRadius: '99px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: score >= 18 ? '#dcfce7' : '#fee2e2',
        color: score >= 18 ? '#15803d' : '#b91c1c'
    }),

    // Section Divider
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '25px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '12px',
        marginTop: '40px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#0f172a',
        margin: 0
    },

    // Table Styling
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        fontSize: '14px',
        marginBottom: '40px'
    },
    th: {
        textAlign: 'left',
        padding: '16px',
        color: '#64748b',
        fontWeight: '700',
        borderBottom: '2px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '1px'
    },
    td: {
        padding: '14px 16px',
        borderBottom: '1px solid #f1f5f9',
        color: '#334155',
        verticalAlign: 'middle'
    },
    tdScore: {
        fontWeight: '800',
        color: '#4f46e5',
        fontSize: '15px'
    },

    // Manglik / Dosha Grid
    grid2: {
        display: 'flex',
        gap: '30px',
        marginBottom: '40px'
    },
    infoCard: {
        flex: 1,
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0'
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '12px',
        display: 'block',
        color: '#0f172a'
    },

    // AI Section
    aiContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        padding: '35px',
        border: '1px solid #e2e8f0',
        borderLeft: '5px solid #8b5cf6',
        position: 'relative'
    },
    aiContent: {
        lineHeight: '1.8',
        color: '#334155',
        fontSize: '15px',
        whiteSpace: 'pre-wrap',
        fontFamily: '"Segoe UI", Roboto, sans-serif' // Ensure readable body font
    },

    footer: {
        marginTop: '60px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '11px',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '20px'
    }
};

const MatchReportPDF = forwardRef(({ matchResult, bride, groom }, ref) => {
    const { t } = useTranslation();

    if (!matchResult || !bride || !groom) return null;

    return (
        <div ref={ref} style={styles.page}>

            {/* Header */}
            <div style={styles.headerContainer}>
                <div style={styles.brand}>
                    ASTROPINCH
                </div>
                <div style={styles.meta}>
                    <div style={styles.date}>{new Date().toLocaleDateString()}</div>
                    <div style={styles.reportId}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
            </div>

            {/* Main Title */}
            <div style={styles.titleBox}>
                <h1 style={styles.mainTitle}>
                    {t('kundaliMatch.reportTitle', 'Vedic Compatibility Report')}
                </h1>
                <p style={styles.subTitle}>
                    {t('common.generatedBy', 'Generated by AstroPinch AI Engine')}
                </p>
            </div>

            {/* Hero Section */}
            <div style={styles.heroGrid}>

                {/* Bride */}
                <div style={styles.profileCard}>
                    <div style={styles.roleLabel}>{t('kundaliMatch.bride', 'Bride')}</div>
                    <h3 style={styles.name}>{bride.name}</h3>
                </div>

                {/* Score Ring */}
                <div style={styles.scoreBox}>
                    <div style={{
                        ...styles.scoreRing,
                        borderColor: matchResult.total_score >= 18 ? '#22c55e' : '#ef4444'
                    }}>
                        <div>
                            <div style={{
                                ...styles.scoreVal,
                                color: matchResult.total_score >= 18 ? '#22c55e' : '#ef4444'
                            }}>{matchResult.total_score}</div>
                            <div style={styles.scoreMax}>/ 36</div>
                        </div>
                    </div>
                    <p style={styles.scoreLabel}>
                        {t('kundaliMatch.overallScore', 'Overall Score')}
                    </p>
                    <span style={styles.statusBadge(matchResult.total_score)}>
                        {matchResult.summary}
                    </span>
                </div>

                {/* Groom */}
                <div style={styles.profileCard}>
                    <div style={styles.roleLabel}>{t('kundaliMatch.groom', 'Groom')}</div>
                    <h3 style={styles.name}>{groom.name}</h3>
                </div>

            </div>

            {/* Ashta Koota Table */}
            <div style={{ marginTop: '50px' }}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>{t('kundaliMatch.ashtaKoota', 'Ashta Koota Breakdown')}</h3>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>{t('kundaliMatch.area', 'Area')}</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>{t('kundaliMatch.points', 'Points')}</th>
                            <th style={styles.th}>{t('kundaliMatch.description', 'Description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchResult.koota_details?.map((k, i) => (
                            <tr key={i}>
                                <td style={{ ...styles.td, fontWeight: '600' }}>{k.name}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>
                                    <span style={{
                                        ...styles.tdScore,
                                        color: (k.points === 0 || (k.name === 'Nadi' && k.points === 0) || (k.name === 'Bhakoot' && k.points === 0)) ? '#ef4444' : '#4f46e5'
                                    }}>
                                        {k.points}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}> / {k.max_points}</span>
                                </td>
                                <td style={styles.td}>{k.significance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manglik & Dosha Grid */}
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>{t('kundaliMatch.manglikAnalysis', 'Dosha Analysis')}</h3>
            </div>
            <div style={styles.grid2}>
                <div style={{
                    ...styles.infoCard,
                    backgroundColor: '#fee2e2',
                    borderColor: '#fca5a5'
                }}>
                    <span style={{ ...styles.cardTitle, color: '#991b1b' }}>Manglik Status</span>
                    <div style={{ marginBottom: '8px', fontSize: '14px', color: '#7f1d1d' }}>
                        <strong>{t('kundaliMatch.bride', 'Bride')}:</strong> {matchResult.bride?.manglik_status}
                    </div>
                    <div style={{ fontSize: '14px', color: '#7f1d1d' }}>
                        <strong>{t('kundaliMatch.groom', 'Groom')}:</strong> {matchResult.groom?.manglik_status}
                    </div>
                </div>

                <div style={{
                    ...styles.infoCard,
                    backgroundColor: '#fff7ed',
                    borderColor: '#fdba74'
                }}>
                    <span style={{ ...styles.cardTitle, color: '#9a3412' }}>Other Major Doshas</span>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#7c2d12' }}>
                        {matchResult.doshas?.filter(d => d.is_present).map((d, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{d.name}</li>
                        ))}
                        {!matchResult.doshas?.some(d => d.is_present) && (
                            <li style={{ fontStyle: 'italic', listStyle: 'none' }}>
                                {t('kundaliMatch.noMajorDoshas', 'No major doshas found')}
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* AI Analysis */}
            <div style={{ marginTop: '40px', pageBreakInside: 'avoid' }}>
                <div style={styles.sectionHeader}>
                    <h3 style={{ ...styles.sectionTitle, color: '#6d28d9' }}>
                        {t('kundaliMatch.expertAnalysis', 'Astrological Expert Analysis')}
                    </h3>
                </div>
                <div style={styles.aiContainer}>
                    <div style={styles.aiContent}>
                        {matchResult.ai_analysis}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p>© {new Date().getFullYear()} AstroPinch. {t('common.allRightsReserved', 'All Rights Reserved')}.</p>
                <p>www.astropinch.com</p>
            </div>
        </div>
    );
});

export default MatchReportPDF;
