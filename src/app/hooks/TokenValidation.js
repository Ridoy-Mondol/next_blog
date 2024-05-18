"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TokenValidation = (WrappedComponent) => {
  const TokenExpiredComponent = (props) => {
    const router = useRouter();
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
      const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');
      if (!token) {
        setTokenValid(false);
        router.replace('/signup');
      }
    }, [router]);

    return tokenValid ? <WrappedComponent {...props} /> : null;
  };

  TokenExpiredComponent.displayName = `TokenExpired(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return TokenExpiredComponent;
};

export default TokenValidation;



// "use client"
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// const TokenValidation = (WrappedComponent) => {
//   return (props) => {
//     const router = useRouter();
//     const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

//     useEffect(() => {
//       if (!token) {
//         router.replace('/signup');
//       }
//     }, [token, router]);

//     return <WrappedComponent {...props} />;
//   };
// };

// export default TokenValidation;

