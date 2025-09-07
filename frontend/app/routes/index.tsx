import IndexPage from '../index/index';
import { useEffect } from 'react';


export default function Index() {
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
    return ( <IndexPage /> )

}
