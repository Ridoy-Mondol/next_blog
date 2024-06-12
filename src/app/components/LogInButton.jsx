import React from 'react';
import { signIn } from 'next-auth/react';
import googleLogo from '@/app/Images/google-logo.png';
import Image from 'next/image';

function Page({ props }) {

  const handleLogIn = async () => {
    sessionStorage.setItem('signIn', 'true');
    await signIn('google', {
      callbackUrl: '/auth/signin',
    });
  };

  return (
    <button
      className="flex items-center border border-gray-300 overflow-hidden px-2 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-[85%] h-[2.75rem]"
      onClick={handleLogIn}
    >
      <Image src={googleLogo} alt="Google Logo" className="w-6 h-auto mr-6" />
      <span className="text-[0.875rem]">{props}</span>
    </button>
  );
}

export default Page;
