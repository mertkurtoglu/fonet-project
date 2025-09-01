import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Yükleniyor...' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className={`spinner-border ${sizeClasses[size]} text-primary me-2`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <span className="text-muted">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
