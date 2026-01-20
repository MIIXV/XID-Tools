import React from 'react';

const Header = ({ onSearch, onAdd }) => {
    return (
        <header className="glass-panel" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: 'var(--max-width)',
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 100,
            boxSizing: 'border-box'
        }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '32px', height: '32px', background: 'var(--accent-color)', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                }}>
                    X
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>XID Tools</h1>
            </div>

            <div className="search-bar" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search tools, tags..."
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.borderColor = 'var(--accent-color)';
                    }}
                    onBlur={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.05)';
                        e.target.style.borderColor = 'var(--glass-border)';
                    }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--text-secondary)'
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            <button className="btn-primary" onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Tool
            </button>
        </header>
    );
};

export default Header;
