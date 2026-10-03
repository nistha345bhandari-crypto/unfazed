import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";

function TherapistDashboard() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getAppointments = async () => {
        try {
            const token =
                localStorage.getItem("therapistToken");

            if (!token) {
                setError(
                    "Please login as a therapist first."
                );
                setLoading(false);
                return;
            }

            const response = await API.get(
                "/appointments/therapist",
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
                "THERAPIST APPOINTMENTS ERROR:",
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

    useEffect(() => {
        getAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token =
                localStorage.getItem("therapistToken");

            await API.put(
                `/appointments/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            getAppointments();
        } catch (error) {
            console.error(
                "UPDATE STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Unable to update appointment."
            );
        }
    };

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">

                {/* HEADER */}

                <div className="dashboard-heading">
                    <div>
                        <p className="dashboard-label">
                            THERAPIST PORTAL
                        </p>

                        <h1>
                            Therapist Dashboard 👋
                        </h1>

                        <p>
                            Manage your patient appointment
                            requests and sessions.
                        </p>
                    </div>

                    <div className="appointment-count">
                        {appointments.length}

                        <span>
                            Requests
                        </span>
                    </div>
                </div>

                

<section className="appointments-section">

    <div className="section-header">

        <h2>
            Quick Actions
        </h2>
<div className="quick-actions-buttons">

            <button
                className="book-btn"
                onClick={() =>
                    navigate(
                        "/therapist-clients"
                    )
                }
            >
                👥 My Clients
            </button>

            <button
                className="book-btn"
                onClick={() =>
                    navigate(
                        "/therapist-analytics"
                    )
                }
            >
                📊 Analytics
            </button>

            <button
                className="book-btn"
                onClick={() =>
                    navigate(
                        "/therapist-subscription"
                    )
                }
            >
                💳 Subscription
            </button>

        </div>

    </div>

</section>

                <section className="appointments-section">

                    <div className="section-header">
                        <h2>
                            Appointment Requests
                        </h2>
                    </div>

                    {/* LOADING */}

                    {loading && (
                        <div className="empty-card">
                            <p>
                                Loading appointment requests...
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

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        appointments.length === 0 && (
                            <div className="empty-card">
                                <h3>
                                    No appointment requests
                                </h3>

                                <p>
                                    New patient requests
                                    will appear here.
                                </p>
                            </div>
                        )}

                    {/* APPOINTMENT CARDS */}

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
                                                PATIENT
                                            </span>

                                            <h3>
                                                {appointment.patientName ||
                                                    "Patient"}
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
                                                PATIENT MESSAGE
                                            </span>

                                            <p>
                                                {
                                                    appointment.message
                                                }
                                            </p>

                                        </div>
                                    )}

                                    {/* ACTIONS */}

                                    {appointment.status ===
                                        "pending" && (
                                        <div className="appointment-actions">

                                            <button
                                                className="accept-btn"
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment._id,
                                                        "accepted"
                                                    )
                                                }
                                            >
                                                ✓ Accept
                                            </button>

                                            <button
                                                className="reject-btn"
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment._id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                ✕ Reject
                                            </button>

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

export default TherapistDashboard;