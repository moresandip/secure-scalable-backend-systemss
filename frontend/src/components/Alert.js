import React from 'react';

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
