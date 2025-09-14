import { useEffect } from "react";
import BusForm from '../bus/busForm'
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import LayoutWrapper from "layout/navLayout";

export function meta() {
  return [
    { title: "Tracking" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function DashboardRoute() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .catch(() => {
        navigate("/login");
      });
  }, [dispatch, navigate]);

  return (
    <LayoutWrapper>
      <BusForm />
    </LayoutWrapper>
  );
}
