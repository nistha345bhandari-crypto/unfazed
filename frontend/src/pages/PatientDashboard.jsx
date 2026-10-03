import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
    const navigate = useNavigate();

    const patient = JSON.parse(
        localStorage.getItem("patient") || "null"
    );

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const token =
                    localStorage.getItem("patientToken");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await API.get(
                    "/appointments/patient",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAppointments(
                    response.data.appointments || []
                );
            } catch (error) {
                console.error(
                    "APPOINTMENTS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load appointments."
                );
            } finally {
                setLoading(false);
            }
        };

        getAppointments();
    }, []);

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">

                {/* DASHBOARD HEADER */}
                <div className="dashboard-heading">
                    <div>
                        <p className="dashboard-label">
                            PATIENT PORTAL
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {patient?.name || "Patient"} 👋
                        </h1>

                        <p>
                            Keep track of your therapy
                            appointments and sessions.
                        </p>
                    </div>

                    <div className="appointment-count">
                        {appointments.length}
                        <span>
                            Appointments
                        </span>
                    </div>
                </div>

                {/* PATIENT PROFILE */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>
                            My Profile
                        </h2>
                    </div>

                    <div className="profile-card">

                        <div className="profile-avatar">
                            {patient?.name
                                ? patient.name
                                      .charAt(0)
                                      .toUpperCase()
                                : "P"}
                        </div>

                        <div className="profile-info">

                            <div>
                                <span className="detail-label">
                                    FULL NAME
                                </span>

                                <p>
                                    {patient?.name ||
                                        "Patient"}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    EMAIL
                                </span>

                                <p>
                                    {patient?.email ||
                                        "No email"}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    ACCOUNT TYPE
                                </span>

                                <p>
                                    Patient
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* APPOINTMENTS */}
                <section className="appointments-section">

                    <div className="section-header">

                        <h2>
                            My Appointments
                        </h2>
<div className="patient-action-buttons">

    {/* MY PACKAGES */}
    <button
        className="book-btn"
        onClick={() =>
            navigate("/patient-packages")
        }
    >
        📦 My Packages
    </button>

    {/* BOOK APPOINTMENT */}
    <button
        className="book-btn"
        onClick={() =>
            navigate("/book-appointment")
        }
    >
        + Book Appointment
    </button>

    {/* SHARED NOTES */}
    <button
        className="book-btn"
        onClick={() =>
            navigate("/patient-shared-notes")
        }
    >
        Shared Session Notes
    </button>

</div>

                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="empty-card">
                            <p>
                                Loading appointments...
                            </p>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="empty-card error-card">
                            <p>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* NO APPOINTMENTS */}
                    {!loading &&
                        !error &&
                        appointments.length === 0 && (
                            <div className="empty-card">

                                <h3>
                                    No appointments yet
                                </h3>

                                <p>
                                    Your booked appointments
                                    will appear here.
                                </p>

                            </div>
                        )}

                    {/* APPOINTMENT LIST */}
                    {!loading &&
                        !error &&
                        appointments.map(
                            (appointment) => (
                                <div
                                    className="appointment-card"
                                    key={appointment._id}
                                >

                                    {/* TOP */}
                                    <div className="appointment-top">

                                        <div>
                                            <span className="card-label">
                                                THERAPIST
                                            </span>

                                            <h3>
                                                {appointment
                                                    .therapist
                                                    ?.name ||
                                                    "Therapist"}
                                            </h3>
                                        </div>

                                        <span
                                            className={`status ${appointment.status}`}
                                        >
                                            {appointment.status}
                                        </span>

                                    </div>

                                    {/* DETAILS */}
                                    <div className="appointment-details">

                                        <div>
                                            <span className="detail-label">
                                                DATE & TIME
                                            </span>

                                            <p>
                                                {new Date(
                                                    appointment.date
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="detail-label">
                                                EMAIL
                                            </span>

                                            <p>
                                                {
                                                    appointment.patientEmail
                                                }
                                            </p>
                                        </div>

                                    </div>

                                    {/* MESSAGE */}
                                    {appointment.message && (
                                        <div className="appointment-message">

                                            <span className="detail-label">
                                                YOUR MESSAGE
                                            </span>

                                            <p>
                                                {
                                                    appointment.message
                                                }
                                            </p>

                                        </div>
                                    )}

                                </div>
                            )
                        )}

                </section>

            </main>
        </div>
    );
}

export default PatientDashboard;