import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import TherapistSubscription from "./pages/TherapistSubscription";
import RoleSelection from "./pages/RoleSelection";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import PatientPackages from "./pages/PatientPackages";
import TherapistLogin from "./pages/TherapistLogin";
import TherapistDashboard from "./pages/TherapistDashboard";
import TherapistClients from "./pages/TherapistClients";
import TherapistClientDetails from "./pages/TherapistClientDetails";
import TherapistSignup from "./pages/TherapistSignup";
import TherapistAnalytics from "./pages/TherapistAnalytics";
import BookAppointment from "./pages/BookAppointment";
import TherapistSessionNotes from "./pages/TherapistSessionNotes";
import SharedSessionNotes from "./pages/SharedSessionNotes";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicTherapistProfile from "./pages/PublicTherapistProfile";

import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================================
                    OPENING PAGE
                ===================================== */}

                <Route
                    path="/"
                    element={<RoleSelection />}
                />


                {/* =====================================
                    PATIENT
                ===================================== */}

                {/* Patient Login */}

                <Route
                    path="/patient-login"
                    element={<PatientLogin />}
                />

                {/* Patient Signup */}

                <Route
                    path="/patient-signup"
                    element={<PatientSignup />}
                />

                {/* Patient Dashboard */}

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Patient Profile */}

                <Route
                    path="/patient-profile"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Patient Packages */}

                <Route
                    path="/patient-packages"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientPackages />
                        </ProtectedRoute>
                    }
                />

                {/* Patient Shared Notes */}

                <Route
                    path="/patient-shared-notes"
                    element={
                        <ProtectedRoute role="patient">
                            <SharedSessionNotes />
                        </ProtectedRoute>
                    }
                />

                {/* Book Appointment */}

                <Route
                    path="/book-appointment"
                    element={
                        <ProtectedRoute role="patient">
                            <BookAppointment />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    THERAPIST
                ===================================== */}

                {/* Therapist Login */}

                <Route
                    path="/therapist-login"
                    element={<TherapistLogin />}
                />

                {/* Therapist Dashboard */}

                <Route
                    path="/therapist"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Therapist Clients */}

                <Route
                    path="/therapist-clients"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistClients />
                        </ProtectedRoute>
                    }
                />

                {/* Therapist Client Details */}

                <Route
                    path="/therapist-clients/:id"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistClientDetails />
                        </ProtectedRoute>
                    }
                />

                {/* Therapist Session Notes */}

                <Route
                    path="/therapist-clients/:id/notes"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistSessionNotes />
                        </ProtectedRoute>
                    }
                />

                {/* Therapist Signup */}

                <Route
                    path="/therapist-signup"
                    element={<TherapistSignup />}
                />

                {/* Therapist Analytics */}

                <Route
                    path="/therapist-analytics"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistAnalytics />
                        </ProtectedRoute>
                    }
                />

                {/* Therapist Subscription */}

                <Route
                    path="/therapist-subscription"
                    element={
                        <ProtectedRoute role="therapist">
                            <TherapistSubscription />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    MESSAGES
                ===================================== */}

                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    NOTIFICATIONS
                ===================================== */}

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    PUBLIC THERAPIST PROFILE
                ===================================== */}

                <Route
                    path="/:slug"
                    element={<PublicTherapistProfile />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;