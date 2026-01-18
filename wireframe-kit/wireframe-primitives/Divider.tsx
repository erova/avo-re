import { HTMLAttributes } from 'react';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {}

export function Divider({ className, ...props }: DividerProps) {
  const baseClass = 'wireframe-divider';
  const classes = className ? `${baseClass} ${className}` : baseClass;

  return <hr className={classes} {...props} />;
}
