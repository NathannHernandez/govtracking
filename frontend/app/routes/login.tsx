import { useEffect } from "react";
import { Login } from "~/Login/login";

export default function Home() {

  useEffect(() => {
    async function checkAuth() {
        const res = await fetch("http://localhost:3001/v1/auth/check-auth", {
          method: "GET",
          credentials: "include", //   ensures cookies are sent
        });
        console.log(res);
        if (res.ok) {
          window.location.href = "/dashboard";
        } 
      }
    checkAuth();
  }, []); // run once on mount


  return <Login />;
}
