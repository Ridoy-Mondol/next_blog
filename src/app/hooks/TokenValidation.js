"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TokenValidation = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

    useEffect(() => {
      if (!token) {
        router.replace('/signup');
      }
    }, [token, router]);

    return <WrappedComponent {...props} />;
  };
};

export default TokenValidation;
