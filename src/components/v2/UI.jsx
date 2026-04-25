import React from 'react';

export const Card = ({ children, className = '', padding = true }) => (
  <div className={`astro-card ${padding ? 'p-4' : ''} ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const classes = variant === 'primary' ? 'astro-button-primary' : 'astro-button-secondary';
  return (
    <button className={`${classes} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-xs font-semibold text-[var(--text-sub)] uppercase tracking-wider ml-1">{label}</label>}
    <input className={`astro-input ${error ? 'border-coral' : ''}`} {...props} />
    {error && <span className="text-xs text-coral font-medium ml-1">{error}</span>}
  </div>
);

export const Badge = ({ children, icon: Icon, className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-[var(--surface)] border border-[var(--border)] text-[var(--text-main)] shadow-sm ${className}`}>
    {Icon && <Icon size={14} className="text-[var(--secondary)]" />}
    <span className="text-xs font-semibold uppercase tracking-tight">{children}</span>
  </div>
);

export const SectionHeader = ({ title, hindiTitle, actionLabel, onAction }) => (
  <div className="flex items-end justify-between px-1 mb-4">
    <div>
      <h2 className="text-[var(--text-main)]">{title}</h2>
      {hindiTitle && <span className="font-hindi text-[var(--text-sub)] opacity-60 text-sm block mt-1">{hindiTitle}</span>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest pb-1">
        {actionLabel}
      </button>
    )}
  </div>
);
