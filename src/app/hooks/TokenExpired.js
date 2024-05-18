"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TokenExpired = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

    useEffect(() => {
      if (token) {
        router.replace('/');
      }
    }, [token, router]);

    return <WrappedComponent {...props} />;
  };
};

export default TokenExpired;
