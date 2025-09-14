import { useEffect } from "react";
import RecordsComponent from "~/records/records";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "redux/store";
import { fetchUser } from "redux/thunks/userThunks";
import LayoutWrapper from "layout/navLayout";
// import { fetchSwdi } from "redux/thunks/swdiThunks";

export function meta() {
  return [
    { title: "Tracking" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function RecordsRoute() {
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
      <RecordsComponent />
    </LayoutWrapper>
  );
}
