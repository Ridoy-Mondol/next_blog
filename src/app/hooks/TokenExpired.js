"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TokenExpired = (WrappedComponent) => {
  const TokenExpiredComponent = (props) => {
    const router = useRouter();
    const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

    useEffect(() => {
      if (!token) {
        router.replace('/');
      }
    }, [token, router]);

    return <WrappedComponent {...props} />;
  };

  TokenExpiredComponent.displayName = `TokenExpired(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return TokenExpiredComponent;
};

export default TokenExpired;

