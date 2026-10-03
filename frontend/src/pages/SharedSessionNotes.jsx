import { useEffect, useState } from "react";
import API from "../services/api";

function SharedSessionNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSharedNotes = async () => {
            try {
                const response = await API.get(
                    "/session-notes/patient/shared"
                );

                setNotes(response.data.notes || []);

            } catch (error) {
                console.error(
                    "FETCH SHARED NOTES ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load shared session notes"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchSharedNotes();

    }, []);

    if (loading) {
        return (
            <div className="loading-page">
                Loading shared session notes...
            </div>
        );
    }

    if (error) {
        return (
            <div className="shared-notes-page">
                <div className="session-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="shared-notes-page">

            {/* HEADER */}

            <div className="shared-notes-header">

                <h1>
                    Shared Session Notes
                </h1>

                <p>
                    Session notes shared with you by your therapist.
                </p>

            </div>


            {/* EMPTY STATE */}

            {notes.length === 0 ? (

                <div className="no-shared-notes">

                    <div className="no-shared-notes-icon">
                        ✓
                    </div>

                    <h2>
                        No Shared Notes
                    </h2>

                    <p>
                        Your therapist has not shared any
                        session notes with you yet.
                    </p>

                </div>

            ) : (

                <div className="shared-notes-list">

                    {notes.map((note) => (

                        <div
                            className="shared-note-card"
                            key={note._id}
                        >

                            {/* NOTE HEADER */}

                            <div className="shared-note-header">

                                <div>

                                    <h2>
                                        {note.title ||
                                            "Session Note"}
                                    </h2>

                                    <p className="shared-note-date">
                                        {new Date(
                                            note.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                                <span className="shared-note-badge">
                                    Shared
                                </span>

                            </div>


                            {/* THERAPIST */}

                            <div className="shared-note-therapist">

                                <span>
                                    Therapist
                                </span>

                                <strong>
                                    {note.therapist?.name ||
                                        "Therapist"}
                                </strong>

                            </div>


                            {/* NOTE TYPE */}

                            <div className="shared-note-type">

                                <span>
                                    Note Type
                                </span>

                                <strong>
                                    {note.noteType}
                                </strong>

                            </div>


                            {/* CONTENT */}

                            <div className="shared-note-content">

                                <h3>
                                    Session Summary
                                </h3>

                                <p>
                                    {note.content}
                                </p>

                            </div>


                            {/* SOAP */}

                            {note.noteType === "SOAP" && (

                                <div className="shared-clinical-section">

                                    <h3>
                                        SOAP Documentation
                                    </h3>


                                    <div className="shared-clinical-grid">

                                        <div className="shared-clinical-item">

                                            <span>
                                                Subjective
                                            </span>

                                            <p>
                                                {note.subjective ||
                                                    "Not provided"}
                                            </p>

                                        </div>


                                        <div className="shared-clinical-item">

                                            <span>
                                                Objective
                                            </span>

                                            <p>
                                                {note.objective ||
                                                    "Not provided"}
                                            </p>

                                        </div>


                                        <div className="shared-clinical-item">

                                            <span>
                                                Assessment
                                            </span>

                                            <p>
                                                {note.assessment ||
                                                    "Not provided"}
                                            </p>

                                        </div>


                                        <div className="shared-clinical-item">

                                            <span>
                                                Plan
                                            </span>

                                            <p>
                                                {note.plan ||
                                                    "Not provided"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* DAP */}

                            {note.noteType === "DAP" && (

                                <div className="shared-clinical-section">

                                    <h3>
                                        DAP Documentation
                                    </h3>


                                    <div className="shared-clinical-grid">

                                        <div className="shared-clinical-item">

                                            <span>
                                                Data
                                            </span>

                                            <p>
                                                {note.subjective ||
                                                    "Not provided"}
                                            </p>

                                        </div>


                                        <div className="shared-clinical-item">

                                            <span>
                                                Assessment
                                            </span>

                                            <p>
                                                {note.assessment ||
                                                    "Not provided"}
                                            </p>

                                        </div>


                                        <div className="shared-clinical-item">

                                            <span>
                                                Plan
                                            </span>

                                            <p>
                                                {note.plan ||
                                                    "Not provided"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default SharedSessionNotes;