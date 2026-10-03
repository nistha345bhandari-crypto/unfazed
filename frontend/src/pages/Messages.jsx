import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Messages() {
    const [receiverId, setReceiverId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const patient = JSON.parse(
        localStorage.getItem("patient") || "null"
    );

    const therapist = JSON.parse(
        localStorage.getItem("therapist") || "null"
    );

    const currentUser = patient || therapist;

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!receiverId || !message.trim()) {
            return;
        }

        try {
            setSending(true);
            setError("");

            await API.post("/messages", {
                receiverId,
                message: message.trim()
            });

            setMessage("");

            await fetchMessages(receiverId);

        } catch (error) {
            console.error(
                "SEND MESSAGE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to send message."
            );

        } finally {
            setSending(false);
        }
    };

    const fetchMessages = async (userId) => {

        if (!userId) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await API.get(
                    `/messages/${userId}`
                );

            setMessages(
                response.data.messages || []
            );

            await API.put(
                `/messages/${userId}/read`
            );

        } catch (error) {
            console.error(
                "GET MESSAGES ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load messages."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="dashboard-page">

            <Navbar />

            <main
                className="dashboard-container"
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto"
                }}
            >

                <div className="dashboard-heading">

                    <div>
                        <p className="dashboard-label">
                            COMMUNICATION
                        </p>

                        <h1>
                            Messages
                        </h1>

                        <p>
                            Communicate securely with your
                            therapist or patient.
                        </p>
                    </div>

                </div>


                {/* USER ID */}

                <section
                    className="profile-section"
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <div className="section-header">

                        <h2>
                            Start Conversation
                        </h2>

                    </div>

                    <div
                        className="profile-card"
                        style={{
                            display: "block"
                        }}
                    >

                        <p
                            style={{
                                marginBottom: "12px",
                                color: "#68756e"
                            }}
                        >
                            {patient
                                ? "Enter your therapist's ID."
                                : "Enter your patient's ID."
                            }
                        </p>

                        <input
                            type="text"
                            value={receiverId}
                            onChange={(e) =>
                                setReceiverId(
                                    e.target.value
                                )
                            }
                            placeholder="Enter user ID"
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px 14px",
                                borderRadius: "10px",
                                border:
                                    "1px solid #dfe7e2",
                                outline: "none",
                                fontSize: "14px"
                            }}
                        />

                        <button
                            className="book-btn"
                            type="button"
                            onClick={() =>
                                fetchMessages(
                                    receiverId
                                )
                            }
                            style={{
                                marginTop: "15px"
                            }}
                        >
                            Open Conversation
                        </button>

                    </div>

                </section>


                {/* ERROR */}

                {error && (
                    <div
                        className="empty-card error-card"
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        <p>
                            {error}
                        </p>
                    </div>
                )}


                {/* MESSAGES */}

                {receiverId && (
                    <section
                        className="appointments-section"
                        style={{
                            marginTop: "30px"
                        }}
                    >

                        <div className="section-header">

                            <h2>
                                Conversation
                            </h2>

                        </div>


                        <div
                            style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                padding: "20px",
                                minHeight: "250px",
                                maxHeight: "500px",
                                overflowY: "auto",
                                boxShadow:
                                    "0 5px 20px rgba(50,70,60,0.07)"
                            }}
                        >

                            {loading ? (

                                <p>
                                    Loading messages...
                                </p>

                            ) : messages.length === 0 ? (

                                <p
                                    style={{
                                        color: "#68756e"
                                    }}
                                >
                                    No messages yet.
                                    Start the conversation below.
                                </p>

                            ) : (

                                messages.map(
                                    (item) => {

                                        const isMine =
                                            item.sender ===
                                            currentUser?._id;

                                        return (
                                            <div
                                                key={item._id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        isMine
                                                            ? "flex-end"
                                                            : "flex-start",
                                                    marginBottom:
                                                        "12px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        maxWidth:
                                                            "70%",
                                                        padding:
                                                            "12px 15px",
                                                        borderRadius:
                                                            "14px",
                                                        background:
                                                            isMine
                                                                ? "#e8f0eb"
                                                                : "#f3f5f4",
                                                        color:
                                                            "#263a32"
                                                    }}
                                                >

                                                    <p>
                                                        {
                                                            item.message
                                                        }
                                                    </p>

                                                    <small
                                                        style={{
                                                            display:
                                                                "block",
                                                            marginTop:
                                                                "6px",
                                                            color:
                                                                "#7a8780"
                                                        }}
                                                    >
                                                        {new Date(
                                                            item.createdAt
                                                        ).toLocaleString()}
                                                    </small>

                                                </div>

                                            </div>
                                        );
                                    }
                                )

                            )}

                        </div>


                        {/* SEND */}

                        <form
                            onSubmit={sendMessage}
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginTop: "15px"
                            }}
                        >

                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Write a message..."
                                style={{
                                    flex: "1 1 300px",
                                    minWidth: "0",
                                    padding:
                                        "13px 15px",
                                    borderRadius:
                                        "10px",
                                    border:
                                        "1px solid #dfe7e2",
                                    outline: "none",
                                    fontSize: "14px"
                                }}
                            />

                            <button
                                className="book-btn"
                                type="submit"
                                disabled={
                                    sending ||
                                    !message.trim()
                                }
                            >
                                {sending
                                    ? "Sending..."
                                    : "Send Message"}
                            </button>

                        </form>

                    </section>
                )}

            </main>

        </div>
    );
}

export default Messages;