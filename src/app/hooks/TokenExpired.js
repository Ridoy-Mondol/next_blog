"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TokenExpired = (WrappedComponent) => {
  const TokenExpiredComponent = (props) => {
    const router = useRouter();
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
      const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');
      if (token) {
        setTokenValid(true);
        router.replace('/');
      }
    }, [router]);

    return tokenValid ? <WrappedComponent {...props} /> : null;
  };

  TokenExpiredComponent.displayName = `TokenExpired(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return TokenExpiredComponent;
};

export default TokenExpired;




// "use client"
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// const TokenExpired = (WrappedComponent) => {
//   return (props) => {
//     const router = useRouter();
//     const token = (typeof localStorage !== 'undefined') && localStorage.getItem('token');

//     useEffect(() => {
//       if (token) {
//         router.replace('/');
//       }
//     }, [token, router]);

//     return <WrappedComponent {...props} />;
//   };
// };

// export default TokenExpired;

