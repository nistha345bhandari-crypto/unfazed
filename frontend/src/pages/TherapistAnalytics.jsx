import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";
import useEntitlement from "../hooks/useEntitlement";

function TherapistAnalytics() {
    const navigate = useNavigate();

    const {
        allowed: analyticsAllowed,
        loading: entitlementLoading
    } = useEntitlement("analytics_basic");

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (entitlementLoading) {
            return;
        }

        if (!analyticsAllowed) {
            setLoading(false);
            return;
        }

        const getAnalytics = async () => {
            try {
                const token =
                    localStorage.getItem("therapistToken");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await API.get(
                    "/analytics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAnalytics(response.data);
            } catch (error) {
                console.error(
                    "ANALYTICS ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load analytics."
                );
            } finally {
                setLoading(false);
            }
        };

        getAnalytics();
    }, [analyticsAllowed, entitlementLoading]);

    if (loading || entitlementLoading) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="dashboard-container">
                    <h2>Loading analytics...</h2>
                </main>
            </div>
        );
    }

    if (!analyticsAllowed) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="dashboard-container">

                    <div className="upgrade-card">

                        <div className="upgrade-icon">
                            🔒
                        </div>

                        <p className="dashboard-label">
                            PREMIUM FEATURE
                        </p>

                        <h1>
                            Analytics is not available
                        </h1>

                        <p>
                            Your current subscription does not
                            include access to the analytics
                            dashboard.
                        </p>

                        <p>
                            Upgrade your subscription to unlock
                            advanced practice analytics.
                        </p>

                        <div className="upgrade-actions">

                            <button
                                className="book-btn"
                                onClick={() =>
                                    navigate("/therapist")
                                }
                            >
                                ← Back to Dashboard
                            </button>

                            <button
                                className="book-btn"
                                onClick={() =>
                                    alert(
                                        "Subscription upgrade will be available here."
                                    )
                                }
                            >
                                Upgrade Subscription
                            </button>

                        </div>

                    </div>

                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="dashboard-container">

                    <div className="empty-card error-card">
                        <p>{error}</p>
                    </div>

                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">

                <div className="dashboard-heading">

                    <div>

                        <p className="dashboard-label">
                            THERAPIST PORTAL
                        </p>

                        <h1>
                            Analytics Dashboard
                        </h1>

                        <p>
                            Track your practice performance
                            and client activity.
                        </p>

                    </div>

                    <button
                        className="book-btn"
                        onClick={() =>
                            navigate("/therapist")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

                <section className="profile-section">

                    <div className="section-header">
                        <h2>Overview</h2>
                    </div>

                    <div className="profile-card">

                        <div className="profile-info">

                            <div>
                                <span className="detail-label">
                                    TOTAL REVENUE
                                </span>

                                <p>
                                    ₹
                                    {analytics?.totalRevenue || 0}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    ACTIVE CLIENTS
                                </span>

                                <p>
                                    {analytics?.totalClients || 0}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    APPOINTMENTS
                                </span>

                                <p>
                                    {analytics?.totalAppointments || 0}
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="appointments-section">

                    <div className="section-header">
                        <h2>
                            Appointment Analytics
                        </h2>
                    </div>

                    <div className="profile-card">

                        <div className="profile-info">

                            <div>
                                <span className="detail-label">
                                    COMPLETED
                                </span>

                                <p>
                                    {analytics?.completedAppointments || 0}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    CANCELLED
                                </span>

                                <p>
                                    {analytics?.cancelledAppointments || 0}
                                </p>
                            </div>

                            <div>
                                <span className="detail-label">
                                    NO-SHOW RATE
                                </span>

                                <p>
                                    {analytics?.noShowRate || 0}
                                    %
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="appointments-section">

                    <div className="section-header">
                        <h2>Revenue Trend</h2>
                    </div>

                    {!analytics?.monthlyRevenue ||
                    analytics.monthlyRevenue.length === 0 ? (
                        <div className="empty-card">

                            <h3>
                                No revenue data yet
                            </h3>

                            <p>
                                Paid transactions will appear
                                here.
                            </p>

                        </div>
                    ) : (
                        <div className="revenue-chart-card">

                            <div className="revenue-chart-header">

                                <div>

                                    <span className="detail-label">
                                        MONTHLY REVENUE
                                    </span>

                                    <h3>
                                        ₹
                                        {analytics.monthlyRevenue.reduce(
                                            (total, item) =>
                                                total +
                                                item.revenue,
                                            0
                                        )}
                                    </h3>

                                </div>

                            </div>

                            <div className="revenue-chart">

                                {analytics.monthlyRevenue.map(
                                    (item) => {

                                        const maxRevenue =
                                            Math.max(
                                                ...analytics.monthlyRevenue.map(
                                                    (data) =>
                                                        data.revenue
                                                )
                                            );

                                        const height =
                                            maxRevenue === 0
                                                ? 0
                                                : (item.revenue /
                                                      maxRevenue) *
                                                  100;

                                        return (
                                            <div
                                                className="revenue-column"
                                                key={
                                                    item._id.month
                                                }
                                            >

                                                <div className="revenue-value">
                                                    ₹
                                                    {item.revenue}
                                                </div>

                                                <div className="revenue-bar-area">

                                                    <div
                                                        className="revenue-bar"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    ></div>

                                                </div>

                                                <span>
                                                    Month{" "}
                                                    {item._id.month}
                                                </span>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default TherapistAnalytics;