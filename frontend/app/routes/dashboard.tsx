
import  Dashboard  from "../dashboard/dashboard";

export function meta() {
  return [
    { title: "Tracking" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function DashboardRoute() {


    return ( <Dashboard /> )

}