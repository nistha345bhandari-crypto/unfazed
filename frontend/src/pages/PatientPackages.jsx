import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";

function PatientPackages() {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [therapistId, setTherapistId] = useState("");

    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState("");

    const availablePackages = [
        {
            type: "3",
            sessions: 3,
            amount: 1500,
            icon: "🌱",
        },
        {
            type: "6",
            sessions: 6,
            amount: 2800,
            icon: "🌿",
        },
        {
            type: "12",
            sessions: 12,
            amount: 5000,
            icon: "🌳",
        },
    ];

    const patient = JSON.parse(
        localStorage.getItem("patient") ||
        localStorage.getItem("currentUser") ||
        "null"
    );

    // =========================
    // FETCH THERAPISTS
    // =========================

    useEffect(() => {
        fetchTherapists();
    }, []);

    const fetchTherapists = async () => {
        try {
            const response = await API.get("/therapists");

            console.log(
                "THERAPISTS RESPONSE:",
                response.data
            );

            const therapistList =
                response.data.therapists ||
                response.data ||
                [];

            setTherapists(therapistList);

            if (therapistList.length > 0) {
                setTherapistId(
                    therapistList[0]._id
                );
            }

        } catch (error) {
            console.error(
                "FETCH THERAPISTS ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load therapists."
            );
        }
    };

    // =========================
    // FETCH ACTIVE PACKAGES
    // =========================

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await API.get(
                "/payments/patient/active"
            );

            console.log(
                "ACTIVE PACKAGES:",
                response.data
            );

            setPackages(
                response.data.packages || []
            );

        } catch (error) {
            console.error(
                "FETCH PACKAGES ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your packages."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DOWNLOAD INVOICE
    // =========================

    const handleDownloadInvoice = async (
        paymentId
    ) => {
        setDownloading(paymentId);
        setError("");

        try {
            const response = await API.get(
                `/payments/invoice/${paymentId}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `unfazed-invoice-${paymentId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(
                "DOWNLOAD INVOICE ERROR:",
                error
            );

            setError(
                "Unable to download invoice. Please try again."
            );

        } finally {
            setDownloading("");
        }
    };

    // =========================
    // LOAD RAZORPAY
    // =========================

    const loadRazorpay = () => {
        return new Promise((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    // =========================
    // BUY PACKAGE
    // =========================

    const handleBuy = async (pkg) => {

        setBuying(pkg.type);
        setMessage("");
        setError("");

        try {

            if (!patient) {
                setError(
                    "Please login as a patient first."
                );

                setBuying("");
                return;
            }

            if (!therapistId) {
                setError(
                    "Please select a therapist first."
                );

                setBuying("");
                return;
            }

            const razorpayLoaded =
                await loadRazorpay();

            if (!razorpayLoaded) {
                setError(
                    "Razorpay failed to load. Please try again."
                );

                setBuying("");
                return;
            }

            const expiryDate = new Date();

            expiryDate.setMonth(
                expiryDate.getMonth() + 3
            );

            console.log(
                "CREATING RAZORPAY ORDER..."
            );

            const orderResponse =
                await API.post(
                    "/payments/create-order",
                    {
                        therapistId,
                        packageType: pkg.type,
                        amount: pkg.amount,
                        expiryDate:
                            expiryDate.toISOString(),
                    }
                );

            console.log(
                "ORDER RESPONSE:",
                orderResponse.data
            );

            const order =
                orderResponse.data.order ||
                orderResponse.data;

            if (!order.id) {
                throw new Error(
                    "Razorpay order ID was not returned."
                );
            }

            const options = {
                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency:
                    order.currency || "INR",

                name: "Unfazed",

                description:
                    `${pkg.sessions} Session Package`,

                order_id: order.id,

                prefill: {
                    name: patient.name || "",
                    email: patient.email || "",
                },

                theme: {
                    color: "#1f6f5b",
                },

                handler: async function (
                    response
                ) {

                    try {

                        console.log(
                            "RAZORPAY RESPONSE:",
                            response
                        );

                        if (
                            !response.razorpay_order_id ||
                            !response.razorpay_payment_id ||
                            !response.razorpay_signature
                        ) {
                            throw new Error(
                                "Razorpay payment details are missing."
                            );
                        }

                        console.log(
                            "VERIFYING PAYMENT..."
                        );

                        const verifyResponse =
                            await API.post(
                                "/payments/verify",
                                {
                                    razorpay_order_id:
                                        response
                                            .razorpay_order_id,

                                    razorpay_payment_id:
                                        response
                                            .razorpay_payment_id,

                                    razorpay_signature:
                                        response
                                            .razorpay_signature,
                                }
                            );

                        console.log(
                            "PAYMENT VERIFIED:",
                            verifyResponse.data
                        );

                        setMessage(
                            "Payment successful! Your package is now active. 🎉"
                        );

                        await fetchPackages();

                    } catch (error) {

                        console.error(
                            "PAYMENT VERIFICATION ERROR:",
                            error.response?.data ||
                            error.message
                        );

                        setError(
                            error.response?.data
                                ?.message ||
                            error.message ||
                            "Payment verification failed."
                        );

                    } finally {

                        setBuying("");
                    }
                },

                modal: {
                    ondismiss: function () {

                        console.log(
                            "RAZORPAY CHECKOUT CLOSED"
                        );

                        setBuying("");
                    },
                },
            };

            console.log(
                "OPENING RAZORPAY..."
            );

            const razorpay =
                new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "RAZORPAY PAYMENT FAILED:",
                        response
                    );

                    setError(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setBuying("");
                }
            );

            razorpay.open();

        } catch (error) {

            console.error(
                "BUY PACKAGE ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to start payment."
            );

            setBuying("");
        }
    };

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="packages-container">

                {/* HEADER */}

                <div className="packages-header">

                    <p className="dashboard-label">
                        YOUR THERAPY PLAN
                    </p>

                    <h1>
                        Manage Your Sessions
                    </h1>

                    <p>
                        Manage your sessions, packages
                        and payments.
                    </p>

                </div>


                {/* MESSAGE */}

                {message && (
                    <div className="form-success">
                        {message}
                    </div>
                )}


                {/* ERROR */}

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                {/* ACTIVE PACKAGES */}

                <section className="packages-section">

                    <div className="section-heading">

                        <div>

                            <p className="dashboard-label">
                                ACTIVE
                            </p>

                            <h2>
                                Your Packages
                            </h2>

                        </div>

                    </div>


                    {loading ? (

                        <div className="loading-card">
                            Loading your packages...
                        </div>

                    ) : packages.length === 0 ? (

                        <div className="empty-package-card">

                            <div className="empty-package-icon">
                                🌱
                            </div>

                            <h3>
                                No active packages
                            </h3>

                            <p>
                                Purchase a session package
                                to start booking therapy
                                appointments.
                            </p>

                        </div>

                    ) : (

                        <div className="packages-grid">

                            {packages.map(
                                (payment) => (

                                    <div
                                        className="package-card active-package"
                                        key={payment._id}
                                    >

                                        <div className="package-card-top">

                                            <span className="package-badge">
                                                ACTIVE
                                            </span>

                                            <span className="package-price">
                                                ₹
                                                {payment.amount}
                                            </span>

                                        </div>


                                        <h3>
                                            {
                                                payment.packageType
                                            }{" "}
                                            Session Package
                                        </h3>


                                        <div className="package-info">

                                            <p className="package-detail">
                                                <strong>
                                                    Sessions:
                                                </strong>{" "}
                                                {
                                                    payment.sessionsPurchased
                                                }
                                            </p>

                                            <p className="package-detail">
                                                <strong>
                                                    Remaining:
                                                </strong>{" "}
                                                {
                                                    payment.sessionsRemaining
                                                }
                                            </p>

                                            <p className="package-detail">
                                                <strong>
                                                    Status:
                                                </strong>{" "}
                                                {
                                                    payment.paymentStatus
                                                }
                                            </p>

                                            <p className="package-detail">
                                                <strong>
                                                    Therapist:
                                                </strong>{" "}
                                                {
                                                    payment
                                                        .therapist
                                                        ?.name ||
                                                    "Unknown"
                                                }
                                            </p>

                                            <p className="package-detail">
                                                <strong>
                                                    Expires:
                                                </strong>{" "}
                                                {new Date(
                                                    payment.expiryDate
                                                ).toLocaleDateString()}
                                            </p>

                                        </div>


                                        {/* DOWNLOAD INVOICE */}

                                        <button
                                            className="package-buy-btn"
                                            onClick={() =>
                                                handleDownloadInvoice(
                                                    payment._id
                                                )
                                            }
                                            disabled={
                                                downloading ===
                                                payment._id
                                            }
                                        >
                                            {downloading ===
                                            payment._id
                                                ? "Downloading..."
                                                : "Download Invoice"}
                                        </button>

                                    </div>
                                )
                            )}

                        </div>

                    )}

                </section>


                {/* BUY PACKAGES */}

                <section className="packages-section">

                    <div className="section-heading">

                        <div>

                            <p className="dashboard-label">
                                CHOOSE A PACKAGE
                            </p>

                            <h2>
                                Buy More Sessions
                            </h2>

                            <p>
                                Select a therapist and
                                package before completing
                                your payment.
                            </p>

                        </div>

                    </div>


                    {/* THERAPIST SELECTION */}

                    <div className="form-group">

                        <label>
                            Choose Therapist
                        </label>

                        <select
                            value={therapistId}
                            onChange={(event) =>
                                setTherapistId(
                                    event.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select a therapist
                            </option>

                            {therapists.map(
                                (therapist) => (

                                    <option
                                        key={therapist._id}
                                        value={therapist._id}
                                    >
                                        {therapist.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* PACKAGE CARDS */}

                    <div className="packages-grid">

                        {availablePackages.map(
                            (pkg) => (

                                <div
                                    className="package-card purchase-package"
                                    key={pkg.type}
                                >

                                    <div className="package-icon">
                                        {pkg.icon}
                                    </div>

                                    <h3>
                                        {pkg.sessions} Sessions
                                    </h3>

                                    <p className="package-description">
                                        Continue your therapy
                                        journey with a flexible
                                        session package.
                                    </p>

                                    <p className="purchase-price">
                                        ₹{pkg.amount}
                                    </p>

                                    <p className="package-validity">
                                        Valid for 3 months
                                    </p>

                                    <button
                                        className="package-buy-btn"
                                        onClick={() =>
                                            handleBuy(pkg)
                                        }
                                        disabled={
                                            buying === pkg.type ||
                                            !therapistId
                                        }
                                    >
                                        {buying === pkg.type
                                            ? "Opening Payment..."
                                            : "Buy Now"}
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* BACK BUTTON */}

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/patient")
                    }
                >
                    ← Back to Dashboard
                </button>

            </main>

        </div>
    );
}

export default PatientPackages;