import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function TherapistClients() {

    const [clients, setClients] = useState([]);

    const [clientLimit, setClientLimit] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const therapistToken =
                    localStorage.getItem("therapistToken");

                const config = {
                    headers: {
                        Authorization:
                            `Bearer ${therapistToken}`
                    }
                };

                // Get clients
                const clientsResponse =
                    await API.get(
                        "/appointments/therapist/clients",
                        config
                    );

                setClients(
                    clientsResponse.data.clients
                );

                // Get subscription client limit
                const limitResponse =
                    await API.get(
                        "/entitlements/client-limit",
                        config
                    );

                setClientLimit(
                    limitResponse.data.clientLimit
                );

            } catch (error) {

                console.error(
                    "CLIENTS / LIMIT ERROR:",
                    error
                );

                setError(
                    "Unable to load client information"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, []);

    if (loading) {

        return (
            <h2>
                Loading clients...
            </h2>
        );

    }

    if (error) {

        return (
            <h2>
                {error}
            </h2>
        );

    }

    const limitReached =
        clientLimit > 0 &&
        clients.length >= clientLimit;

    return (

        <div style={{ padding: "30px" }}>

            <h1>
                My Clients
            </h1>

            <p
                style={{
                    marginTop: "10px",
                    marginBottom: "20px"
                }}
            >
                Clients: {clients.length} /{" "}
                {clientLimit}
            </p>

            {limitReached && (

                <div
                    style={{
                        padding: "20px",
                        marginBottom: "25px",
                        borderRadius: "12px",
                        background: "#fff3cd",
                        border: "1px solid #ffe69c"
                    }}
                >

                    <h3>
                        Client limit reached
                    </h3>

                    <p>
                        Your current subscription
                        has reached its client limit.
                        Upgrade your plan to manage
                        more clients.
                    </p>

                    <button
                        className="book-btn"
                        onClick={() =>
                            navigate(
                                "/therapist-subscription"
                            )
                        }
                    >
                        Upgrade Subscription
                    </button>

                </div>

            )}

            {clients.length === 0 ? (

                <p>
                    No clients found.
                </p>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        marginTop: "25px"
                    }}
                >

                    {clients.map((client) => (

                        <div
                            key={client.id}
                            onClick={() =>
                                navigate(
                                    `/therapist-clients/${client.id}`
                                )
                            }
                            style={{
                                padding: "20px",
                                borderRadius: "15px",
                                background: "#ffffff",
                                boxShadow:
                                    "0 5px 20px rgba(0,0,0,0.08)",
                                cursor: "pointer"
                            }}
                        >

                            <h2>
                                {client.name}
                            </h2>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {client.email}
                            </p>

                            {client.profile ? (

                                <>

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}

                                        {client.profile.phone ||
                                            "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            Gender:
                                        </strong>{" "}

                                        {client.profile.gender ||
                                            "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}

                                        {client.profile.address ||
                                            "Not provided"}
                                    </p>

                                </>

                            ) : (

                                <p>
                                    No profile information yet.
                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default TherapistClients;