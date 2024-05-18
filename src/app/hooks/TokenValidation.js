"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TokenValidation = (WrappedComponent) => {
  const TokenValidationComponent = (props) => {
    const router = useRouter();
    const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

    useEffect(() => {
      if (!token) {
        router.replace('/signup');
      }
    }, [token, router]);

    return <WrappedComponent {...props} />;
  };

  TokenValidationComponent.displayName = `TokenValidation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return TokenValidationComponent;
};

export default TokenValidation;

