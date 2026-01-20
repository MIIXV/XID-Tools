import React from 'react';

const ToolCard = ({ tool, onOpen, onEdit, onDelete }) => {
    return (
        <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0,0,0,0.3)';
                e.currentTarget.querySelector('.tool-actions').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                e.currentTarget.querySelector('.tool-actions').style.opacity = '0';
            }}
            onClick={() => onOpen(tool)}
        >
            {/* Image Section */}
            <div style={{
                height: '180px',
                width: '100%',
                background: `url(${tool.image_url || 'https://placehold.co/600x400/1e293b/FFF?text=No+Preview'}) center/cover no-repeat`,
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 100%)'
                }} />
            </div>

            {/* Content Section */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>{tool.title}</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    {tool.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
                    {tool.tags && tool.tags.map((tag, i) => (
                        <span key={i} style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hover Actions Overlay */}
            <div className="tool-actions" style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem',
                opacity: 0,
                transition: 'opacity 0.2s ease',
            }}>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(tool); }}
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        width: '32px', height: '32px', borderRadius: '8px',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(tool); }}
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)', // Red tint
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        width: '32px', height: '32px', borderRadius: '8px',
                        color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                    title="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '16px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ToolCard;
