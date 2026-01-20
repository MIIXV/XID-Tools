import React, { useState, useEffect } from 'react';
import { toolsService } from '../services/toolsService';

const AddToolModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        image_url: '',
        tags: ''
    });
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Cover image state
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [isCoverDragging, setIsCoverDragging] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                tags: initialData.tags ? initialData.tags.join(', ') : ''
            });
            setFile(null);
            setCoverImageFile(null);
        } else {
            setFormData({
                title: '',
                description: '',
                url: '',
                image_url: '',
                tags: ''
            });
            setFile(null);
            setCoverImageFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalUrl = formData.url;
            let finalImageUrl = formData.image_url;

            // If a file is selected, upload it first
            if (file) {
                finalUrl = await toolsService.uploadToolFile(file);
            }

            // If a cover image is selected, upload it
            if (coverImageFile) {
                finalImageUrl = await toolsService.uploadToolFile(coverImageFile);
            }

            const toolData = {
                title: formData.title,
                description: formData.description,
                image_url: finalImageUrl,
                url: finalUrl,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            await onSave(toolData);
            onClose();
        } catch (error) {
            alert('Error saving tool: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.html') || droppedFile.name.endsWith('.htm'))) {
            setFile(droppedFile);
            setFormData({ ...formData, url: '' });
        } else {
            alert('Please upload an HTML file');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFormData({ ...formData, url: '' });
        }
    };

    // Cover Image Handlers
    const handleCoverDragOver = (e) => {
        e.preventDefault();
        setIsCoverDragging(true);
    };

    const handleCoverDragLeave = (e) => {
        e.preventDefault();
        setIsCoverDragging(false);
    };

    const handleCoverDrop = (e) => {
        e.preventDefault();
        setIsCoverDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setCoverImageFile(droppedFile);
            setFormData({ ...formData, image_url: '' });
        } else {
            alert('Please upload an image file');
        }
    };

    const handleCoverPaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                setCoverImageFile(blob);
                setFormData({ ...formData, image_url: '' });
                e.preventDefault(); // Prevent pasting into other inputs if focused
                return;
            }
        }
    };

    const handleCoverFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setCoverImageFile(selectedFile);
            setFormData({ ...formData, image_url: '' });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
        }}
        >
            <div
                className="glass-panel"
                style={{
                    width: '90%',
                    maxWidth: '500px',
                    padding: '2rem',
                    borderRadius: '16px',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                    {initialData ? 'Edit Tool' : 'Add New Tool'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Tool Source Section */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>Tool Source</label>

                        {/* Drag & Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                            style={{
                                border: `2px dashed ${isDragging ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)'}`,
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center',
                                background: isDragging ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                position: 'relative'
                            }}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                accept=".html,.htm"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />

                            {file ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '24px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{file.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        tk-html • {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        style={{
                                            marginTop: '0.5rem',
                                            background: 'none', border: 'none',
                                            color: '#fca5a5', fontSize: '0.8rem', cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '28px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Click or drag HTML file here</p>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Supports .html files</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0 1rem' }}>
                            <span style={{
                                background: '#0F172A', padding: '0 0.5rem',
                                fontSize: '0.8rem', color: 'var(--text-secondary)',
                                position: 'relative', zIndex: 1
                            }}>OR</span>
                            <div style={{
                                position: 'absolute', top: '50%', left: 0, right: 0,
                                height: '1px', background: 'var(--glass-border)', zIndex: 0
                            }} />
                        </div>

                        <div>
                            <input
                                type="url"
                                placeholder="Paste external URL (e.g. https://...)"
                                value={formData.url}
                                disabled={!!file}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                                    background: !!file ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white', fontSize: '0.9rem',
                                    opacity: !!file ? 0.5 : 1, // Visual disable state
                                    transition: 'all 0.2s ease'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                color: 'white', fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                color: 'white', fontSize: '1rem', fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div onPaste={handleCoverPaste}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cover Image (Optional)</label>

                        {/* Cover Image Drag & Drop Zone */}
                        <div
                            onDragOver={handleCoverDragOver}
                            onDragLeave={handleCoverDragLeave}
                            onDrop={handleCoverDrop}
                            onClick={() => document.getElementById('cover-upload').click()}
                            style={{
                                border: `2px dashed ${isCoverDragging ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)'}`,
                                borderRadius: '12px',
                                padding: coverImageFile || formData.image_url ? '1rem' : '2rem',
                                textAlign: 'center',
                                background: isCoverDragging ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255,255,255,0.02)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                position: 'relative',
                                minHeight: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverFileSelect}
                                style={{ display: 'none' }}
                            />

                            {coverImageFile ? (
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <img
                                        src={URL.createObjectURL(coverImageFile)}
                                        alt="Preview"
                                        style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCoverImageFile(null);
                                        }}
                                        style={{
                                            position: 'absolute', top: '-10px', right: '-10px',
                                            background: '#ef4444', color: 'white',
                                            border: 'none', borderRadius: '50%',
                                            width: '24px', height: '24px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {coverImageFile.name}
                                    </div>
                                </div>
                            ) : formData.image_url ? (
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData({ ...formData, image_url: '' });
                                        }}
                                        style={{
                                            position: 'absolute', top: '-10px', right: '-10px',
                                            background: '#ef4444', color: 'white',
                                            border: 'none', borderRadius: '50%',
                                            width: '24px', height: '24px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Upload a file</span> or drag and drop
                                    </p>
                                    <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
                                        Paste (Ctrl/Cmd+V) supported
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Fallback URL Input - Optional if user prefers typing */}
                        {!coverImageFile && (
                            <input
                                type="url"
                                placeholder="Or enter image URL..."
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                    color: 'white', fontSize: '0.9rem',
                                    marginTop: '0.75rem'
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="util, converter, html"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                color: 'white', fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '8px',
                                background: 'transparent', border: '1px solid var(--glass-border)',
                                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="btn-primary"
                            style={{
                                flex: 2, padding: '0.75rem', borderRadius: '8px',
                                border: 'none',
                                color: 'white', cursor: 'pointer', fontSize: '1rem',
                                fontWeight: 600,
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {uploading ? 'Start Uploading...' : (initialData ? 'Save Changes' : 'Add Tool')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToolModal;
