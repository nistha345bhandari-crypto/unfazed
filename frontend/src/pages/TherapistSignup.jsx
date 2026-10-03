import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function TherapistSignup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [specializations, setSpecializations] = useState("");
    const [languages, setLanguages] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await API.post("/auth/register", {
                name,
                email,
                password,
                bio,

                specializations: specializations
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                languages: languages
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            });

            setSuccess("Therapist account created successfully!");

            setTimeout(() => {
                navigate("/therapist-login");
            }, 1200);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create therapist account"
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

                    <h1>Therapist Sign Up</h1>

                    <p>
                        Create your therapist account and start managing
                        your practice.
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

                    <div className="form-group">
                        <label>Bio</label>

                        <textarea
                            placeholder="Tell clients about yourself"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Specializations</label>

                        <input
                            type="text"
                            placeholder="Anxiety, Depression, CBT"
                            value={specializations}
                            onChange={(e) =>
                                setSpecializations(e.target.value)
                            }
                        />

                        <small>
                            Separate multiple specializations with commas.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Languages</label>

                        <input
                            type="text"
                            placeholder="English, Hindi"
                            value={languages}
                            onChange={(e) =>
                                setLanguages(e.target.value)
                            }
                        />

                        <small>
                            Separate multiple languages with commas.
                        </small>
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
        Don't have an account?{" "}

        <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/therapist-signup")}
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

export default TherapistSignup;