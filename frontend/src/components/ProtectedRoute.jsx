import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const patientToken = localStorage.getItem("patientToken");
  const therapistToken = localStorage.getItem("therapistToken");

  if (role === "patient" && !patientToken) {
    return <Navigate to="/patient-login" replace />;
  }

  if (role === "therapist" && !therapistToken) {
    return <Navigate to="/therapist-login" replace />;
  }

  return children;
}

export default ProtectedRoute;