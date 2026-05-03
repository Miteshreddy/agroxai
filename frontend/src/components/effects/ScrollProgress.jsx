import React, { useState, useEffect } from 'react';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            if (totalHeight > 0) {
                setScrollProgress((currentScroll / totalHeight) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${scrollProgress}%`,
                height: '3px',
                backgroundColor: '#2D4B37',
                zIndex: 9999,
                boxShadow: '0 0 6px #2D4B37',
                transition: 'width 0.1s ease-out'
            }}
        />
    );
};

export default ScrollProgress;
