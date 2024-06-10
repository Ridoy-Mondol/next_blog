"use client"
import { signIn } from 'next-auth/react';
// import { Google } from 'next-auth/providers';

function Page() {
  const signInHandler = () => {
    signIn('google', {
      callbackUrl: "/"
    });
  };

  return (
    <div>
      <button onClick={signInHandler}>Sign In</button>
    </div>
  );
}

export default Page;
