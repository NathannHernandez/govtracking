//import type { Route } from "./+types/home";
import { Register } from "~/Register/register";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { get } from "component/fetchComponent";


type User = {
  logged_in: boolean
}


export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const { data: check_auth_public, isLoading } = useQuery<User>({
    queryKey: ["checkAuthPublic"],
    queryFn: () =>
      get<User>(`${import.meta.env.VITE_BACKEND_API_URL}/v1/auth/check-auth-public`),
    staleTime: 1000 * 60, 
  })
  
  useEffect(() => {
    if (check_auth_public?.logged_in) {
      navigate("/dashboard")
    }
  }, [check_auth_public, navigate])

  if (isLoading) return null 

  if (check_auth_public?.logged_in) return null 

  return <Register />;
}
