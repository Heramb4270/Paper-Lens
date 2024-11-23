import React from 'react';

export const ScrollArea = ({ children, className, ...props }) => (
  <div className={`relative overflow-auto ${className}`} {...props}>
    {children}
  </div>
);

