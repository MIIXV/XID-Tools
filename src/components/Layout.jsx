import React from 'react';
import Header from './Header';

const Layout = ({ children, onSearch, onAdd }) => {
    return (
        <>
            <Header onSearch={onSearch} onAdd={onAdd} />
            <main className="container" style={{
                paddingTop: 'calc(var(--header-height) + 40px)',
                paddingBottom: '40px',
                flex: 1
            }}>
                {children}
            </main>
        </>
    );
};

export default Layout;
