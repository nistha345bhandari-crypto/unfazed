import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

function TherapistClientDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [client, setClient] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        const fetchClient = async () => {

            try {

                const therapistToken =
                    localStorage.getItem("therapistToken");

                const response = await API.get(
                    `/appointments/therapist/clients/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${therapistToken}`
                        }
                    }
                );

                setClient(response.data.client);

                const appointmentsResponse =
                    await API.get(
                        `/appointments/therapist/clients/${id}/appointments`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${therapistToken}`
                            }
                        }
                    );

                setAppointments(
                    appointmentsResponse.data.appointments
                );

            } catch (error) {

                console.error(
                    "CLIENT DETAILS ERROR:",
                    error
                );

                setError(
                    "Unable to load client details"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchClient();

    }, [id]);

    if (loading) {

        return <h2>Loading client...</h2>;

    }

    if (error) {

        return <h2>{error}</h2>;

    }

    if (!client) {

        return <h2>Client not found</h2>;

    }

    const profile = client.profile;

    return (

        <div style={{ padding: "30px" }}>

            <h1>Client Details</h1>

            <div
                style={{
                    marginTop: "25px",
                    padding: "25px",
                    borderRadius: "15px",
                    background: "#ffffff",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.08)"
                }}
            >

                <h2>{client.name}</h2>

                <p>
                    <strong>Email:</strong>{" "}
                    {client.email}
                </p>

                <hr />

                <h3>Personal Information</h3>

                <p>
                    <strong>Phone:</strong>{" "}
                    {profile?.phone || "Not provided"}
                </p>

                <p>
                    <strong>Date of Birth:</strong>{" "}
                    {profile?.dateOfBirth
                        ? new Date(
                              profile.dateOfBirth
                          ).toLocaleDateString()
                        : "Not provided"}
                </p>

                <p>
                    <strong>Gender:</strong>{" "}
                    {profile?.gender || "Not provided"}
                </p>

                <p>
                    <strong>Address:</strong>{" "}
                    {profile?.address || "Not provided"}
                </p>

                <hr />

                <h3>Emergency Contact</h3>

                <p>
                    <strong>Name:</strong>{" "}
                    {profile?.emergencyContactName ||
                        "Not provided"}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {profile?.emergencyContactPhone ||
                        "Not provided"}
                </p>

            </div>


            {/* APPOINTMENT HISTORY */}

            <div
                style={{
                    marginTop: "25px",
                    padding: "25px",
                    borderRadius: "15px",
                    background: "#ffffff",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.08)"
                }}
            >

                <h2>Appointment History</h2>

                {appointments.length === 0 ? (

                    <p style={{ marginTop: "15px" }}>
                        No appointments found.
                    </p>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gap: "15px",
                            marginTop: "20px"
                        }}
                    >

                        {appointments.map(
                            (appointment) => (

                                <div
                                    key={appointment._id}
                                    style={{
                                        padding: "15px",
                                        borderRadius: "10px",
                                        background: "#f5f5f5"
                                    }}
                                >

                                    <p>
                                        <strong>
                                            Date:
                                        </strong>{" "}

                                        {new Date(
                                            appointment.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {appointment.status}
                                    </p>

                                    <p>
                                        <strong>
                                            Message:
                                        </strong>{" "}

                                        {appointment.message ||
                                            "No message"}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* SESSION NOTES BUTTON */}

            <div
                style={{
                    marginTop: "25px"
                }}
            >

                <button
                    onClick={() =>
                        navigate(
                            `/therapist-clients/${id}/notes`
                        )
                    }
                    style={{
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#23483f",
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    Clinical Session Notes
                </button>

            </div>

        </div>

    );
}

export default TherapistClientDetails;