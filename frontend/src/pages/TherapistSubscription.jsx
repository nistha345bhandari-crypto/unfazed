import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api.js";

function TherapistSubscription() {

    const navigate = useNavigate();

    const [currentTier, setCurrentTier] = useState("basic");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchSubscription = async () => {

            try {

                const response =
                    await API.get(
                        "/entitlements/subscription"
                    );

                setCurrentTier(
                    response.data.tier
                );

            } catch (error) {

                console.error(
                    "GET SUBSCRIPTION ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchSubscription();

    }, []);

    const handleUpgrade = async (tier) => {

        try {

            const response = await API.put(
                "/entitlements/subscription",
                {
                    tier
                }
            );

            alert(response.data.message);

            setCurrentTier(tier);

        } catch (error) {

            console.error(
                "SUBSCRIPTION UPDATE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update subscription"
            );

        }
    };

    const getButtonText = (tier) => {

        if (currentTier === tier) {
            return "Current Plan";
        }

        if (tier === "professional") {
            return "Upgrade to Professional";
        }

        if (tier === "premium") {
            return "Upgrade to Premium";
        }

        return "Switch to Basic";
    };

    return (
        <div className="page-container">

            <div className="page-header">

                <div>

                    <p className="eyebrow">
                        THERAPIST PORTAL
                    </p>

                    <h1>
                        Subscription Plans
                    </h1>

                    <p>
                        Choose a plan to unlock more
                        Unfazed features.
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


            {loading ? (

                <p>
                    Loading subscription...
                </p>

            ) : (

                <div className="subscription-grid">

                    {/* BASIC */}

                    <div className="subscription-card">

                        <h2>
                            Basic
                        </h2>

                        <p>
                            Essential tools for
                            starting your practice.
                        </p>

                        <ul>

                            <li>
                                Active client management
                            </li>

                            <li>
                                Basic session notes
                            </li>

                            <li>
                                Basic analytics
                            </li>

                        </ul>

                        <button
                            className="book-btn"
                            disabled={
                                currentTier === "basic"
                            }
                            onClick={() =>
                                handleUpgrade("basic")
                            }
                        >
                            {getButtonText("basic")}
                        </button>

                    </div>


                    {/* PROFESSIONAL */}

                    <div className="subscription-card">

                        <h2>
                            Professional
                        </h2>

                        <p>
                            More capacity and
                            advanced clinical tools.
                        </p>

                        <ul>

                            <li>
                                Higher client limit
                            </li>

                            <li>
                                Basic + advanced
                                session notes
                            </li>

                            <li>
                                Advanced analytics
                            </li>

                        </ul>

                        <button
                            className="book-btn"
                            disabled={
                                currentTier === "professional"
                            }
                            onClick={() =>
                                handleUpgrade(
                                    "professional"
                                )
                            }
                        >
                            {getButtonText(
                                "professional"
                            )}
                        </button>

                    </div>


                    {/* PREMIUM */}

                    <div className="subscription-card">

                        <h2>
                            Premium
                        </h2>

                        <p>
                            Full practice analytics
                            and advanced features.
                        </p>

                        <ul>

                            <li>
                                Higher client limit
                            </li>

                            <li>
                                Advanced session notes
                            </li>

                            <li>
                                Full analytics
                            </li>

                        </ul>

                        <button
                            className="book-btn"
                            disabled={
                                currentTier === "premium"
                            }
                            onClick={() =>
                                handleUpgrade(
                                    "premium"
                                )
                            }
                        >
                            {getButtonText(
                                "premium"
                            )}
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default TherapistSubscription;