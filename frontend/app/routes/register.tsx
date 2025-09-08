//import type { Route } from "./+types/home";
import { Register } from "~/Register/register";


export function meta() {
  return [
    { title: "Register Page" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Home() {
  return <Register />;
}
