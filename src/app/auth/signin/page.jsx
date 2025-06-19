"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
const Callback = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const sendSessionData = async () => {
      if (status === "authenticated" && session) {
        const signIn = sessionStorage.getItem("signIn");

        if (signIn === "true") {
          sessionStorage.removeItem("signIn");

          try {
            const response = await fetch("/api/users/googleLogIn", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: session.user.email,
              }),
            });

            const data = await response.json();
            if (data.success) {
              toast.success(data.message);
              setCookie("token2", data.token, { maxAge: 10 * 24 * 60 * 60 });
              window.location.href = "/";
            } else {
              toast.error(data.message);
              setTimeout(() => {
                window.location.href = "/login";
              }, 1000);
            }
          } catch (error) {
            console.error("Error sending session data:", error);
          }
        }
      }
    };

    if (status !== "loading") {
      sendSessionData();
    }
  }, [session, status]);
};

export default Callback;
