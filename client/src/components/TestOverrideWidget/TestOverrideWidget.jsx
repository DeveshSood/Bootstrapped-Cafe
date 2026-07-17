import React, { useState, useEffect } from 'react';

export default function TestOverrideWidget() {
  const [testDate, setTestDate] = useState(localStorage.getItem('testDate') || '');

  const handleChange = (e) => {
    const val = e.target.value;
    setTestDate(val);
    if (val) {
      localStorage.setItem('testDate', val);
    } else {
      localStorage.removeItem('testDate');
    }
    window.dispatchEvent(new Event('testDateChanged'));
  };

  useEffect(() => {
    const handleTestDate = () => {
      setTestDate(localStorage.getItem('testDate') || '');
    };
    window.addEventListener('testDateChanged', handleTestDate);
    return () => window.removeEventListener('testDateChanged', handleTestDate);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: 9999,
      background: 'var(--white)',
      padding: '4px 8px',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      border: '1px solid var(--border-light)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.7rem',
      opacity: 0.7,
      transition: 'opacity 0.2s',
      transform: 'scale(0.85)',
      transformOrigin: 'bottom left'
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
    >
      <span style={{ fontWeight: 600, color: 'var(--espresso)', display: 'none' }} className="test-override-label">TEST:</span>
      <select 
        value={testDate}
        onChange={handleChange}
        style={{
          padding: '2px 4px',
          borderRadius: '4px',
          border: '1px solid rgba(0,0,0,0.1)',
          background: 'transparent',
          color: 'var(--espresso-soft)',
          fontSize: '0.8rem',
          cursor: 'pointer'
        }}
      >
        <option value="">Today (Default)</option>
        <option value="2024-01-01">Monday</option>
        <option value="2024-01-02">Tuesday</option>
        <option value="2024-01-03">Wednesday</option>
        <option value="2024-01-04">Thursday</option>
        <option value="2024-01-05">Friday</option>
        <option value="2024-01-06">Saturday</option>
        <option value="2024-01-07">Sunday</option>
      </select>
    </div>
  );
}
