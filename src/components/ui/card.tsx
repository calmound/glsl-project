import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', footer, headerAction, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      onClick={onClick}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          {title && <h3 className="font-medium text-lg text-gray-800">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>
  );
};

export default Card;
