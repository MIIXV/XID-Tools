import React, { useState, useEffect } from 'react';

const AddToolModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        image_url: '',
        tags: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags ? initialData.tags.join(', ') : ''
            });
        } else {
            setFormData({ title: '', description: '', url: '', image_url: '', tags: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                onClick={e => e.stopPropagation()}
                style={{
                    width: '500px', maxWidth: '90%', padding: '2rem',
                    background: 'rgba(30, 41, 59, 0.9)', // Slightly more opaque for modal
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    {initialData ? 'Edit Tool' : 'Add New Tool'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                color: 'white', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                color: 'white', boxSizing: 'border-box', fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tool URL (HTML file)</label>
                            <input
                                required
                                type="text"
                                placeholder="/colormove/index.html"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                                    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                    color: 'white', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Image URL</label>
                            <input
                                type="text"
                                placeholder="/images/preview.png"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                                    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                    color: 'white', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="Design, Generator, Util"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                                color: 'white', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
                                background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                        >
                            {initialData ? 'Update Tool' : 'Add Tool'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToolModal;
