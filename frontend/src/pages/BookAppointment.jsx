import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function BookAppointment() {
    const navigate = useNavigate();

    const patient = JSON.parse(
        localStorage.getItem("patient") ||
        localStorage.getItem("currentUser") ||
        "null"
    );

    const [therapists, setTherapists] = useState([]);
    const [therapistId, setTherapistId] = useState("");

    const [availability, setAvailability] = useState([]);
    const [selectedAvailability, setSelectedAvailability] =
        useState("");

    const [packages, setPackages] = useState([]);
    const [selectedPayment, setSelectedPayment] =
        useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================
    // FETCH THERAPISTS
    // =====================================

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
                response.data.therapists || [];

            setTherapists(therapistList);

            if (therapistList.length > 0) {
                setTherapistId(
                    therapistList[0]._id
                );
            }
        } catch (error) {
            console.error(
                "THERAPISTS ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load therapists."
            );

            setLoading(false);
        }
    };

    // =====================================
    // FETCH BOOKING DATA
    // =====================================

    useEffect(() => {
        if (therapistId) {
            fetchBookingData();
        }
    }, [therapistId]);

    const fetchBookingData = async () => {
        setLoading(true);
        setError("");

        // =====================================
        // FETCH AVAILABLE SLOTS
        // =====================================

        try {
            const availabilityResponse = await API.get(
                `/availability/therapist/${therapistId}`
            );

            console.log(
                "AVAILABILITY RESPONSE:",
                availabilityResponse.data
            );

            const availableSlots =
                availabilityResponse.data.availability ||
                availabilityResponse.data.slots ||
                [];

            setAvailability(availableSlots);

        } catch (error) {
            console.error(
                "AVAILABILITY ERROR:",
                error.response?.data ||
                error.message
            );

            setAvailability([]);

            setError(
                error.response?.data?.message ||
                "Failed to load available appointment slots."
            );
        }

        // =====================================
        // FETCH ACTIVE PATIENT PACKAGES
        // =====================================

        try {
            const packagesResponse = await API.get(
                "/payments/patient/active"
            );

            console.log(
                "PAYMENTS RESPONSE:",
                packagesResponse.data
            );

            const activePackages =
                packagesResponse.data.packages ||
                [];

            const therapistPackages =
                activePackages.filter((payment) => {

                    if (payment.therapist?._id) {
                        return (
                            payment.therapist._id ===
                            therapistId
                        );
                    }

                    if (
                        typeof payment.therapist ===
                        "string"
                    ) {
                        return (
                            payment.therapist ===
                            therapistId
                        );
                    }

                    return false;
                });

            setPackages(therapistPackages);

            if (therapistPackages.length > 0) {
                setSelectedPayment(
                    therapistPackages[0]._id
                );
            } else {
                setSelectedPayment("");
            }

        } catch (error) {
            console.error(
                "PAYMENTS ERROR:",
                error.response?.data ||
                error.message
            );

            setPackages([]);

            setError(
                error.response?.data?.message ||
                "Failed to load active session packages."
            );
        }

        setLoading(false);
    };

    // =====================================
    // BOOK APPOINTMENT
    // =====================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!patient) {
            setError(
                "Patient information not found. Please login again."
            );
            return;
        }

        if (!selectedAvailability) {
            setError(
                "Please select an available time slot."
            );
            return;
        }

        if (!selectedPayment) {
            setError(
                "Please select a paid session package."
            );
            return;
        }

        const selectedSlot = availability.find(
            (slot) =>
                slot._id === selectedAvailability
        );

        if (!selectedSlot) {
            setError(
                "Selected availability slot could not be found."
            );
            return;
        }

        setBooking(true);

        try {
            const token =
                localStorage.getItem("patientToken");

            if (!token) {
                setError(
                    "Please login as a patient first."
                );

                setBooking(false);
                return;
            }

            const response = await API.post(
                "/appointments",
                {
                    therapistId,

                    availabilityId:
                        selectedSlot._id,

                    paymentId:
                        selectedPayment,

                    patientName:
                        patient.name,

                    patientEmail:
                        patient.email,

                    date:
                        selectedSlot.date,

                    startTime:
                        selectedSlot.startTime,

                    endTime:
                        selectedSlot.endTime,

                    message
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "APPOINTMENT CREATED:",
                response.data
            );

            setSuccess(
                "Appointment request sent successfully! 🎉"
            );

            setSelectedAvailability("");
            setMessage("");

            await fetchBookingData();

        } catch (error) {
            console.error(
                "BOOK APPOINTMENT ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to book appointment."
            );

        } finally {
            setBooking(false);
        }
    };

    // =====================================
    // LOADING
    // =====================================

    if (loading) {
        return (
            <div className="dashboard-page">

                <Navbar />

                <main className="booking-container">

                    <div className="booking-header">

                        <p className="dashboard-label">
                            BOOK A SESSION
                        </p>

                        <h1>
                            Schedule an Appointment
                        </h1>

                        <p>
                            Loading available sessions...
                        </p>

                    </div>

                </main>

            </div>
        );
    }

    // =====================================
    // PAGE
    // =====================================

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="booking-container">

                <div className="booking-header">

                    <p className="dashboard-label">
                        BOOK A SESSION
                    </p>

                    <h1>
                        Schedule an Appointment
                    </h1>

                    <p>
                        Choose a suitable time for your
                        therapy session.
                    </p>

                </div>

                <form
                    className="booking-form"
                    onSubmit={handleSubmit}
                >

                    {/* THERAPIST */}

                    <div className="form-group">

                        <label>
                            Therapist
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

                    {/* AVAILABLE SLOT */}

                    <div className="form-group">

                        <label>
                            Available Date & Time
                        </label>

                        {availability.length === 0 ? (

                            <p className="form-error">
                                No available appointment
                                slots found.
                            </p>

                        ) : (

                            <select
                                value={
                                    selectedAvailability
                                }
                                onChange={(event) =>
                                    setSelectedAvailability(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select an available slot
                                </option>

                                {availability.map(
                                    (slot) => (

                                        <option
                                            key={slot._id}
                                            value={slot._id}
                                        >

                                            {new Date(
                                                slot.date
                                            ).toLocaleDateString()}

                                            {" — "}

                                            {slot.startTime}

                                            {" - "}

                                            {slot.endTime}

                                        </option>

                                    )
                                )}

                            </select>

                        )}

                    </div>

                    {/* SESSION PACKAGE */}

                    <div className="form-group">

                        <label>
                            Session Package
                        </label>

                        {packages.length === 0 ? (

                            <p className="form-error">
                                No active paid package
                                available for this therapist.
                            </p>

                        ) : (

                            <select
                                value={selectedPayment}
                                onChange={(event) =>
                                    setSelectedPayment(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select a package
                                </option>

                                {packages.map(
                                    (payment) => (

                                        <option
                                            key={payment._id}
                                            value={payment._id}
                                        >

                                            {payment.packageType}
                                            {"-Session Package — "}

                                            {payment.sessionsRemaining}

                                            {" sessions remaining — ₹"}

                                            {payment.amount}

                                        </option>

                                    )
                                )}

                            </select>

                        )}

                    </div>

                    {/* MESSAGE */}

                    <div className="form-group">

                        <label>
                            Message
                        </label>

                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            placeholder="Tell the therapist briefly what you'd like help with..."
                            rows="5"
                        />

                    </div>

                    {/* ERROR */}

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    {/* SUCCESS */}

                    {success && (
                        <p className="form-success">
                            {success}
                        </p>
                    )}

                    {/* SUBMIT */}

                    <button
                        className="booking-btn"
                        type="submit"
                        disabled={
                            booking ||
                            availability.length === 0 ||
                            packages.length === 0
                        }
                    >

                        {booking
                            ? "Booking..."
                            : "Request Appointment"}

                    </button>

                </form>

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

export default BookAppointment;