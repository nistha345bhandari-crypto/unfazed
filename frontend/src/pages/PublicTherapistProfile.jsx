import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function PublicTherapistProfile() {

    const { slug } = useParams();

    const [therapist, setTherapist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedService, setExpandedService] = useState(null);

    useEffect(() => {

        const fetchTherapist = async () => {

            try {

                const response =
                    await API.get(
                        `/therapists/public/${slug}`
                    );

                setTherapist(
                    response.data.therapist
                );

            } catch (error) {

                console.error(
                    "PUBLIC THERAPIST ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Therapist profile not found"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchTherapist();

    }, [slug]);


    // Open Graph / page metadata
    useEffect(() => {

        if (!therapist) {
            return;
        }

        document.title =
            `${therapist.name} | Unfazed`;

        const setMeta = (
            property,
            content
        ) => {

            let meta =
                document.querySelector(
                    `meta[property="${property}"]`
                );

            if (!meta) {

                meta =
                    document.createElement("meta");

                meta.setAttribute(
                    "property",
                    property
                );

                document.head.appendChild(meta);

            }

            meta.setAttribute(
                "content",
                content
            );

        };

        setMeta(
            "og:title",
            `${therapist.name} | Unfazed`
        );

        setMeta(
            "og:description",
            therapist.bio ||
            `View ${therapist.name}'s therapist profile on Unfazed.`
        );

        setMeta(
            "og:type",
            "profile"
        );

        setMeta(
            "og:url",
            window.location.href
        );

        return () => {

            document.title = "Unfazed";

        };

    }, [therapist]);


    if (loading) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>
                    Loading therapist profile...
                </h2>
            </div>
        );

    }


    if (error) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>
                    {error}
                </h2>
            </div>
        );

    }


    return (

        <div
            style={{
                minHeight: "100vh",
                padding: "50px 30px",
                background: "#f5f7fb"
            }}
        >

            {/* HERO */}

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    padding: "40px",
                    borderRadius: "20px",
                    background: "#ffffff",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)"
                }}
            >

                <p
                    style={{
                        color: "#6c63ff",
                        fontWeight: "600",
                        letterSpacing: "1px"
                    }}
                >
                    UNFAZED THERAPIST PROFILE
                </p>

                <h1
                    style={{
                        fontSize: "42px",
                        marginTop: "10px",
                        marginBottom: "15px"
                    }}
                >
                    {therapist.name}
                </h1>

                <p
                    style={{
                        fontSize: "18px",
                        lineHeight: "1.7",
                        color: "#555"
                    }}
                >
                    {therapist.bio ||
                        "Professional therapist available through Unfazed."}
                </p>

            </div>


            {/* ABOUT */}

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "30px auto 0",
                    padding: "30px",
                    borderRadius: "20px",
                    background: "#ffffff"
                }}
            >

                <h2>
                    About
                </h2>

                <p
                    style={{
                        marginTop: "10px",
                        lineHeight: "1.7",
                        color: "#555"
                    }}
                >
                    {therapist.bio ||
                        "This therapist has not added an about description yet."}
                </p>

            </div>


            {/* SPECIALIZATIONS */}

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "30px auto 0"
                }}
            >

                <h2>
                    Specializations
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginTop: "20px"
                    }}
                >

                    {therapist.specializations &&
                    therapist.specializations.length > 0 ? (

                        therapist.specializations.map(
                            (specialization, index) => (

                                <div
                                    key={index}
                                    style={{
                                        padding: "25px",
                                        borderRadius: "16px",
                                        background: "#ffffff",
                                        boxShadow:
                                            "0 5px 20px rgba(0,0,0,0.06)"
                                    }}
                                >

                                    <h3>
                                        {specialization}
                                    </h3>

                                    <p
                                        style={{
                                            marginTop: "8px",
                                            color: "#666"
                                        }}
                                    >
                                        Professional support
                                        available in this area.
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No specializations added yet.
                        </p>

                    )}

                </div>

            </div>


            {/* SERVICES */}

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "35px auto"
                }}
            >

                <h2>
                    Services
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginTop: "20px"
                    }}
                >

                    {therapist.specializations &&
                    therapist.specializations.length > 0 ? (

                        therapist.specializations.map(
                            (service, index) => (

                                <div
                                    key={index}
                                    style={{
                                        padding: "25px",
                                        borderRadius: "16px",
                                        background: "#ffffff",
                                        boxShadow:
                                            "0 5px 20px rgba(0,0,0,0.06)"
                                    }}
                                >

                                    <h3>
                                        {service}
                                    </h3>

                                    <p
                                        style={{
                                            marginTop: "10px",
                                            color: "#666",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        Professional support
                                        tailored to your needs.
                                    </p>


                                    {/* LEARN MORE */}

                                    <button
                                        onClick={() =>
                                            setExpandedService(
                                                expandedService === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                        style={{
                                            marginTop: "15px",
                                            padding: "10px 18px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#6c63ff",
                                            color: "#ffffff",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {expandedService === index
                                            ? "Show Less"
                                            : "Learn More"}
                                    </button>


                                    {/* EXTRA SERVICE INFORMATION */}

                                    {expandedService === index && (

                                        <p
                                            style={{
                                                marginTop: "15px",
                                                color: "#555",
                                                lineHeight: "1.6"
                                            }}
                                        >
                                            This service is provided by{" "}
                                            {therapist.name}.
                                            You can explore this area
                                            of support and book an
                                            appointment with the therapist
                                            through Unfazed.
                                        </p>

                                    )}

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            Services will be available soon.
                        </p>

                    )}

                </div>

            </div>


            {/* LANGUAGES */}

            <div
                style={{
                    maxWidth: "1000px",
                    margin: "35px auto"
                }}
            >

                <h2>
                    Languages
                </h2>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginTop: "15px"
                    }}
                >

                    {therapist.languages &&
                    therapist.languages.length > 0 ? (

                        therapist.languages.map(
                            (language, index) => (

                                <span
                                    key={index}
                                    style={{
                                        padding:
                                            "10px 18px",
                                        borderRadius: "20px",
                                        background: "#ffffff",
                                        border:
                                            "1px solid #e5e7eb"
                                    }}
                                >
                                    {language}
                                </span>

                            )
                        )

                    ) : (

                        <p>
                            Languages not specified.
                        </p>

                    )}

                </div>

            </div>

        </div>

    );
}

export default PublicTherapistProfile;