import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.error(
                "GET NOTIFICATIONS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchNotifications();

    }, []);


    const markAsRead = async (notificationId) => {

        try {

            await API.put(
                `/notifications/${notificationId}/read`
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === notificationId
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.error(
                "MARK NOTIFICATION READ ERROR:",
                error
            );

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
                            UPDATES
                        </p>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with your
                            appointments and Unfazed activity.
                        </p>

                    </div>

                </div>


                {loading && (
                    <div
                        className="empty-card"
                        style={{
                            marginTop: "30px"
                        }}
                    >
                        <p>
                            Loading notifications...
                        </p>
                    </div>
                )}


                {!loading && error && (
                    <div
                        className="empty-card"
                        style={{
                            marginTop: "30px"
                        }}
                    >
                        <p>
                            {error}
                        </p>
                    </div>
                )}


                {!loading &&
                    !error &&
                    notifications.length === 0 && (

                        <div
                            className="empty-card"
                            style={{
                                marginTop: "30px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "12px"
                                }}
                            >
                                🔔
                            </div>

                            <h3>
                                No notifications
                            </h3>

                            <p>
                                You're all caught up.
                            </p>

                        </div>

                    )}


                {!loading &&
                    !error &&
                    notifications.length > 0 && (

                        <section
                            style={{
                                marginTop: "30px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px"
                                }}
                            >

                                {notifications.map(
                                    (notification) => (

                                        <div
                                            key={notification._id}
                                            style={{
                                                padding: "20px",
                                                borderRadius: "16px",
                                                background:
                                                    notification.isRead
                                                        ? "#ffffff"
                                                        : "#edf7f0",
                                                border:
                                                    notification.isRead
                                                        ? "1px solid #e2e9e5"
                                                        : "1px solid #cfe7d5",
                                                boxShadow:
                                                    "0 5px 20px rgba(50,70,60,0.06)"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    gap: "15px"
                                                }}
                                            >

                                                <div>

                                                    <h3
                                                        style={{
                                                            marginBottom:
                                                                "8px",
                                                            color:
                                                                "#263a32"
                                                        }}
                                                    >
                                                        {notification.title ||
                                                            "Notification"}
                                                    </h3>

                                                    <p
                                                        style={{
                                                            color:
                                                                "#68756e",
                                                            lineHeight:
                                                                "1.6"
                                                        }}
                                                    >
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    {notification.createdAt && (
                                                        <small
                                                            style={{
                                                                display:
                                                                    "block",
                                                                marginTop:
                                                                    "10px",
                                                                color:
                                                                    "#7a8780"
                                                            }}
                                                        >
                                                            {new Date(
                                                                notification.createdAt
                                                            ).toLocaleString()}
                                                        </small>
                                                    )}

                                                </div>


                                                {!notification.isRead && (

                                                    <button
                                                        className="book-btn"
                                                        type="button"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                    >
                                                        Mark as Read
                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}

            </main>

        </div>
    );
}

export default Notifications;