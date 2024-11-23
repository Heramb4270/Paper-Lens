import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext({});

export const Dialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
};

export const DialogTrigger = ({ children, asChild, ...props }) => {
  const { setOpen } = useContext(DialogContext);
  const Trigger = asChild ? React.cloneElement(children, { ...props, onClick: () => setOpen(true) }) : 'button';
  return asChild ? Trigger : <Trigger onClick={() => setOpen(true)} {...props}>{children}</Trigger>;
};

export const DialogContent = ({ children, className, ...props }) => {
  const { open, setOpen } = useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={`relative bg-background p-6 shadow-lg ${className}`} {...props}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
);

export const DialogDescription = ({ children, className, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

