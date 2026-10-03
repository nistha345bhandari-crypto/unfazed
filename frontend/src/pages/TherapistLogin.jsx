import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function TherapistLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email,
                password,
            });

            const data = response.data;

            // Remove old patient session
            localStorage.removeItem("patientToken");
            localStorage.removeItem("patient");

            // Save therapist session
            localStorage.setItem("therapistToken", data.token);
            localStorage.setItem(
                "therapist",
                JSON.stringify(data.therapist)
            );

            navigate("/therapist");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );
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

                    <h1>Therapist Login</h1>

                    <p>
                        Sign in to manage your practice and clients.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="booking-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* SIGN UP OPTION */}

                <div className="auth-footer">

                    <p>
                        Don't have an account?{" "}

                        <button
                            type="button"
                            className="auth-link"
                            onClick={() =>
                                navigate("/therapist-signup")
                            }
                        >
                            Sign up
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

export default TherapistLogin;