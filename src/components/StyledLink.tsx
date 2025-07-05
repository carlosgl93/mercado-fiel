import React from 'react';
import { Link } from 'react-router-dom';

type LinkProps = {
  children: React.ReactNode;
  to: string;
};

export const StyledLink = ({ children, to }: LinkProps) => {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {children}
    </Link>
  );
};
