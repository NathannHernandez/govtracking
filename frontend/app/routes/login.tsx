import { useEffect, useState } from "react";
import { Login } from "~/Login/login";
import { useNavigate } from "react-router-dom";

type User = {
  logged_in: boolean;
};

export default function Home() {
  const navigate = useNavigate();
  const [checkAuthStatus, setCheckAuthStatus] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/v1/auth/check-auth-public`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
        if (response.ok) {
          const data: User = await response.json();
          setCheckAuthStatus(data);
           //console.log("Data : ",data)
          if (data.logged_in) {
            navigate("/dashboard");
          }
        } else {
          setCheckAuthStatus(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          // Handle the error, and you can access the status code here
          console.error('Error message:', error.message);
          // Optionally, you can extract the status code from the error message
          const statusCode = error.message.match(/Status: (\d+)/)?.[1];
           //console.log('Status Code:', statusCode);
        } else {
          // Handle unexpected errors
          console.error('Unexpected error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();
  }, [navigate]);

  if (isLoading) return null; // Optionally, render a loading spinner

  if (!checkAuthStatus?.logged_in) {
    return <Login />;
  }

  return null; // Optionally, render a loading spinner or placeholder
}
