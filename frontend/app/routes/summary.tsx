import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SummaryPage from '../summary/summary '
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import LayoutWrapper from "layout/navLayout";


export function meta() {
  return [
    { title: "Tracking" },
    { name: "description", content: "View your dashboard" },
  ];
}


export default function SummaryRoute() {
    const user = useSelector((state : RootState) => state.user)
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

            <SummaryPage />
        </LayoutWrapper>

    )
}