import React from 'react';

const EmptyState = ({ 
  title = 'Veri Bulunamadı', 
  message = 'Henüz hiç veri bulunmamaktadır.',
  icon = '📭',
  actionButton = null 
}) => {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <span style={{ fontSize: '3rem' }}>{icon}</span>
      </div>
      <h4 className="text-muted mb-2">{title}</h4>
      <p className="text-muted mb-3">{message}</p>
      {actionButton && actionButton}
    </div>
  );
};

export default EmptyState;
