import React from 'react';

const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <span>{message}</span>
      </div>
      <div>
        {onRetry && (
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm me-2"
            onClick={onRetry}
          >
            Tekrar Dene
          </button>
        )}
        {onDismiss && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
