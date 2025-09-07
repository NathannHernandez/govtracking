import { useEffect, useState } from "react";
import  Dashboard  from "../dashboard/dashboard";

export default function DashboardRoute() {

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch("http://localhost:3001/v1/auth/check-auth", {
              method: "GET",
              credentials: "include", //   ensures cookies are sent
            });
            console.log(res);
            if (!res.ok) {
                window.location.href = "/login";
            }

        }
        checkAuth();
    }, []); // run once on mount

    return ( <Dashboard /> )

}