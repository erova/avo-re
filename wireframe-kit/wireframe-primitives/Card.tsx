import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  const baseClass = 'wireframe-card';
  const classes = className ? `${baseClass} ${className}` : baseClass;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
