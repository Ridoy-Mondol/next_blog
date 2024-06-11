import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import googleLogo from '@/app/Images/google-logo.png';
import Image from 'next/image';
import { setCookie } from 'cookies-next';
import { toast } from 'react-toastify';

function Page({ props }) {
  const { data: session } = useSession();

  const handleLogIn = async () => {
    await signIn('google');

    if (session) {
      try {
        const response = await fetch('/api/users/googleLogIn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          setCookie('token2', data.token, { maxAge: 10 * 24 * 60 * 60 });
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Error sending session data:', error);
      }
    }
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
