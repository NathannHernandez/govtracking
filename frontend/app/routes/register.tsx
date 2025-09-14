//import type { Route } from "./+types/home";
import { Register } from "~/Register/register";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Register Page" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
      async function checkAuth() {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/auth/check-auth`, {
            method: "GET",
            credentials: "include", //   ensures cookies are sent
          });
          if (res.ok) {
            navigate("/dashboard");
          } 
        }
      checkAuth();
    }, []); // run once on mount

  return <Register />;
}
