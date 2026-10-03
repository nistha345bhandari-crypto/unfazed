import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";

function PatientProfile() {
    const navigate = useNavigate();

    const [patient, setPatient] = useState({});
    const [profile, setProfile] = useState({});

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        phone: "",
        dateOfBirth: "",
        gender: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        address: "",
    });

    // =========================
    // FETCH PROFILE
    // =========================

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("patientToken");

            if (!token) {
                setError("Please login as a patient first.");
                setLoading(false);
                return;
            }

            const response = await API.get(
                "/patient-profile/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "PATIENT PROFILE RESPONSE:",
                response.data
            );

            // Patient information
            const storedPatient = JSON.parse(
                localStorage.getItem("patient") ||
                "null"
            );

            setPatient(
                response.data.patient ||
                storedPatient ||
                {}
            );

            // Profile information
            const profileData =
                response.data.profile || {};

            setProfile(profileData);

            setForm({
                phone: profileData.phone || "",

                dateOfBirth:
                    profileData.dateOfBirth
                        ? new Date(
                              profileData.dateOfBirth
                          )
                              .toISOString()
                              .split("T")[0]
                        : "",

                gender:
                    profileData.gender || "",

                emergencyContactName:
                    profileData.emergencyContactName ||
                    "",

                emergencyContactPhone:
                    profileData.emergencyContactPhone ||
                    "",

                address:
                    profileData.address || "",
            });

        } catch (error) {
            console.error(
                "PROFILE ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("patientToken");

            if (!token) {
                setError(
                    "Please login as a patient first."
                );

                setSaving(false);
                return;
            }

            const response = await API.put(
                "/patient-profile/",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "PROFILE UPDATED:",
                response.data
            );

            setSuccess(
                "Profile updated successfully! ✓"
            );

            await fetchProfile();

        } catch (error) {
            console.error(
                "UPDATE PROFILE ERROR:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="dashboard-page">
                <Navbar />

                <main className="dashboard-container">

                    <div className="empty-card">
                        <h2>
                            Loading your profile...
                        </h2>
                    </div>

                </main>
            </div>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="dashboard-page">

            <Navbar />

            <main className="dashboard-container">

                {/* HEADER */}

                <div className="dashboard-heading">

                    <div>

                        <p className="dashboard-label">
                            PATIENT PORTAL
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View and update your personal
                            information.
                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="empty-card error-card">
                        <p>{error}</p>
                    </div>
                )}


                {/* SUCCESS */}

                {success && (
                    <div className="empty-card">
                        <p>{success}</p>
                    </div>
                )}


                {/* PROFILE CARD */}

                <section className="profile-section">

                    <div className="section-header">

                        <h2>
                            Personal Information
                        </h2>

                    </div>


                    <div className="profile-card">

                        {/* AVATAR */}

                        <div className="profile-avatar">

                            {(patient?.name || "P")
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        {/* BASIC INFORMATION */}

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


                {/* EDITABLE PROFILE */}

                <section className="profile-section">

                    <div className="section-header">

                        <h2>
                            Contact & Personal Details
                        </h2>

                    </div>


                    <form
                        className="booking-form"
                        onSubmit={handleSubmit}
                    >

                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />

                        </div>


                        {/* DATE OF BIRTH */}

                        <div className="form-group">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={
                                    form.dateOfBirth
                                }
                                onChange={handleChange}
                            />

                        </div>


                        {/* GENDER */}

                        <div className="form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows="4"
                            />

                        </div>


                        {/* EMERGENCY CONTACT */}

                        <div className="form-group">

                            <label>
                                Emergency Contact Name
                            </label>

                            <input
                                type="text"
                                name="emergencyContactName"
                                value={
                                    form.emergencyContactName
                                }
                                onChange={handleChange}
                                placeholder="Emergency contact name"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Emergency Contact Phone
                            </label>

                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={
                                    form.emergencyContactPhone
                                }
                                onChange={handleChange}
                                placeholder="Emergency contact phone"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div>

                            <button
                                className="booking-btn"
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Profile"}
                            </button>


                            <button
                                className="back-btn"
                                type="button"
                                onClick={() =>
                                    navigate("/patient")
                                }
                            >
                                ← Back to Dashboard
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default PatientProfile;