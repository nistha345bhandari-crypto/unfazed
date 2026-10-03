import { useNavigate } from "react-router-dom";

function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-page">

            <div className="role-card">

                <div className="role-logo">
                    UNFAZED
                </div>

                <p className="role-label">
                    MENTAL HEALTH PLATFORM
                </p>

                <h1>
                    Care that feels human.
                </h1>

                <p className="role-description">
                    Welcome to Unfazed. Choose how you want to continue.
                </p>

                <div className="role-options">

                    <button
                        className="role-option"
                        onClick={() => navigate("/patient-login")}
                    >
                        <div className="role-icon">
                            🧑‍💻
                        </div>

                        <div>
                            <h2>I'm a Patient</h2>
                            <p>
                                Book sessions and manage your appointments.
                            </p>
                        </div>

                        <span className="role-arrow">
                            →
                        </span>
                    </button>


                    <button
                        className="role-option"
                        onClick={() => navigate("/therapist-login")}
                    >
                        <div className="role-icon">
                            🩺
                        </div>

                        <div>
                            <h2>I'm a Therapist</h2>
                            <p>
                                Manage clients, appointments and your practice.
                            </p>
                        </div>

                        <span className="role-arrow">
                            →
                        </span>
                    </button>

                </div>

                <p className="role-footer">
                    A safe space to connect, heal and grow.
                </p>

            </div>

        </div>
    );
}

export default RoleSelection;