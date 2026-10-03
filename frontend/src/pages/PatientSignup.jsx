import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PatientSignup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            console.log("Registering patient...");

            const response = await API.post(
                "/auth/patient/register",
                {
                    name,
                    email,
                    password,
                }
            );

            console.log("Signup response:", response.data);

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/patient-login");
            }, 1200);

        } catch (err) {
            console.error("PATIENT SIGNUP ERROR:", err);

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);

                setError(
                    err.response.data?.message ||
                    err.response.data?.error ||
                    `Registration failed (${err.response.status})`
                );
            } else if (err.request) {
                setError(
                    "Server is not responding. Make sure your backend is running."
                );
            } else {
                setError("Something went wrong. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="role-logo">
                        UNFAZED
                    </div>

                    <h1>Patient Sign Up</h1>

                    <p>
                        Create your account and start your journey with Unfazed.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="form-success">
                            {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="booking-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">

                    <p>
                        Already have an account?{" "}

                        <button
                            type="button"
                            className="auth-link"
                            onClick={() =>
                                navigate("/patient-login")
                            }
                        >
                            Sign in
                        </button>
                    </p>

                    <p style={{ marginTop: "8px" }}>
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() => navigate("/")}
                        >
                            ← Back to role selection
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default PatientSignup;