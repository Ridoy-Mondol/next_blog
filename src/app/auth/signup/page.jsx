"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { toast } from 'react-toastify';
const Callback = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const sendSessionData = async () => {
      if (status === 'authenticated' && session) {
        const signingUp = sessionStorage.getItem('signingUp');
        
        if (signingUp === 'true') {
          sessionStorage.removeItem('signingUp');
          
          try {
            const response = await fetch('/api/users/googlesignup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }),
            });

            const data = await response.json();
            if (data.success) {
              toast.success(data.message);
              setCookie('token2', data.token, { maxAge: 10 * 24 * 60 * 60 });
              window.location.href = '/';
            } else {
                toast.error(data.message);
                setTimeout(() => {
                    window.location.href = '/signup';
                }, 1000);
            }
            
          } catch (error) {
            console.error('Error sending session data:', error);
          }
        }
      }
    };

    if (status !== 'loading') {
      sendSessionData();
    }
  }, [session, status]);

};

export default Callback;
