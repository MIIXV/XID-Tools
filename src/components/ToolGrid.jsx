import React from 'react';

const ToolGrid = ({ children }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            width: '100%'
        }}>
            {children}
        </div>
    );
};

export default ToolGrid;
