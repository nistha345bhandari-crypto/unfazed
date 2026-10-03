import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const patient = localStorage.getItem("patient");
    const therapist = localStorage.getItem("therapist");

    const logout = () => {

        localStorage.removeItem("patientToken");
        localStorage.removeItem("patient");

        localStorage.removeItem("therapistToken");
        localStorage.removeItem("therapist");

        navigate("/");
    };

    return (

        <nav className="navbar">

            <h2
                className="navbar-logo"
                onClick={() => navigate("/")}
            >
                Unfazed
            </h2>

            <div className="navbar-links">

                {/* PATIENT */}

                {patient && (
                    <>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/patient")
                            }
                        >
                            Dashboard
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/patient-profile")
                            }
                        >
                            My Profile
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/messages")
                            }
                        >
                            Messages
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/notifications")
                            }
                        >
                            Notifications
                        </button>

                    </>
                )}


                {/* THERAPIST */}

                {therapist && (
                    <>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/therapist")
                            }
                        >
                            Dashboard
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/therapist-clients")
                            }
                        >
                            My Clients
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/messages")
                            }
                        >
                            Messages
                        </button>

                        <button
                            className="navbar-btn"
                            onClick={() =>
                                navigate("/notifications")
                            }
                        >
                            Notifications
                        </button>

                    </>
                )}


                {/* LOGOUT */}

                {(patient || therapist) && (
                    <button
                        className="navbar-btn logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
}

export default Navbar;