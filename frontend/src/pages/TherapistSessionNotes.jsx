import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TherapistSessionNotes() {
    const { id: patientId } = useParams();

    const [notes, setNotes] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [patient, setPatient] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        visibility: "private",
        noteType: "general",
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
    });

    useEffect(() => {
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                notesResponse,
                appointmentsResponse,
                patientResponse
            ] = await Promise.all([
                API.get(
                    `/session-notes/patient/${patientId}`
                ),

                API.get(
                    "/appointments/therapist"
                ),

                API.get(
                    `/appointments/therapist/clients/${patientId}`
                )
            ]);

            setNotes(
                notesResponse.data.notes || []
            );

            setAppointments(
                appointmentsResponse.data.appointments || []
            );

            setPatient(
                patientResponse.data.client
            );

        } catch (error) {
            console.error(
                "FETCH SESSION NOTES DATA ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load clinical information"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm({
            title: "",
            content: "",
            visibility: "private",
            noteType: "general",
            subjective: "",
            objective: "",
            assessment: "",
            plan: ""
        });

        setEditingNoteId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            // EDIT EXISTING NOTE
            if (editingNoteId) {
                await API.put(
                    `/session-notes/${editingNoteId}`,
                    form
                );

                resetForm();
                await fetchData();

                return;
            }

            // CREATE NEW NOTE
            if (!patient?.email) {
                setError(
                    "Patient email could not be found."
                );

                return;
            }

            const patientAppointments =
                appointments.filter(
                    (appointment) =>
                        appointment.patientEmail
                            ?.toLowerCase() ===
                        patient.email.toLowerCase()
                );

            const appointment =
                patientAppointments[0];

            if (!appointment) {
                setError(
                    "No appointment found for this patient."
                );

                return;
            }

            await API.post(
                "/session-notes",
                {
                    patientId,
                    appointmentId:
                        appointment._id,
                    ...form
                }
            );

            resetForm();
            await fetchData();

        } catch (error) {
            console.error(
                "SAVE SESSION NOTE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save session note"
            );
        }
    };

    const handleEdit = (note) => {
        setEditingNoteId(note._id);

        setForm({
            title: note.title || "",
            content: note.content || "",
            visibility:
                note.visibility || "private",
            noteType:
                note.noteType || "general",
            subjective:
                note.subjective || "",
            objective:
                note.objective || "",
            assessment:
                note.assessment || "",
            plan:
                note.plan || ""
        });

        setShowForm(true);
    };

    const handleDelete = async (noteId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await API.delete(
                `/session-notes/${noteId}`
            );

            await fetchData();

        } catch (error) {
            console.error(
                "DELETE SESSION NOTE ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete note"
            );
        }
    };

    if (loading) {
        return (
            <div className="loading-page">
                Loading session notes...
            </div>
        );
    }

    return (
        <div className="session-notes-page">

            {/* HEADER */}
            <div className="session-notes-header">

                <h1>
                    Clinical Session Notes
                </h1>

                <p>
                    Manage private and shared clinical
                    documentation for this patient.
                </p>

            </div>


            {/* PATIENT INFORMATION */}
            {patient && (
                <div className="session-patient-card">

                    <div className="session-patient-avatar">
                        {patient.name
                            ?.charAt(0)
                            ?.toUpperCase() || "P"}
                    </div>

                    <div className="session-patient-info">

                        <span>
                            Patient
                        </span>

                        <strong>
                            {patient.name}
                        </strong>

                        <p>
                            {patient.email}
                        </p>

                    </div>

                </div>
            )}


            {/* ERROR */}
            {error && (
                <div className="session-error">
                    {error}
                </div>
            )}


            {/* SECTION HEADER */}
            <div className="session-section-header">

                <h2>
                    Session Notes
                </h2>

                <button
                    className="create-note-btn"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "+ Create Session Note"}
                </button>

            </div>


            {/* FORM */}
            {showForm && (
                <form
                    className="session-note-form"
                    onSubmit={handleSubmit}
                >

                    <h3>
                        {editingNoteId
                            ? "Edit Session Note"
                            : "New Session Note"}
                    </h3>


                    {/* TITLE */}
                    <div className="form-group">

                        <label>
                            Note Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Therapy Session"
                            value={form.title}
                            onChange={handleChange}
                        />

                    </div>


                    {/* CONTENT */}
                    <div className="form-group">

                        <label>
                            Session Note
                        </label>

                        <textarea
                            name="content"
                            placeholder="Write your clinical session note..."
                            value={form.content}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* VISIBILITY */}
                    <div className="form-group">

                        <label>
                            Visibility
                        </label>

                        <select
                            name="visibility"
                            value={form.visibility}
                            onChange={handleChange}
                        >
                            <option value="private">
                                Private
                            </option>

                            <option value="shared">
                                Shared with Patient
                            </option>
                        </select>

                    </div>


                    {/* NOTE TYPE */}
                    <div className="form-group">

                        <label>
                            Note Type
                        </label>

                        <select
                            name="noteType"
                            value={form.noteType}
                            onChange={handleChange}
                        >
                            <option value="general">
                                General
                            </option>

                            <option value="SOAP">
                                SOAP
                            </option>

                            <option value="DAP">
                                DAP
                            </option>
                        </select>

                    </div>


                    {/* SOAP */}
                    {form.noteType === "SOAP" && (
                        <div className="clinical-fields">

                            <h4>
                                SOAP Documentation
                            </h4>


                            <div className="form-group">

                                <label>
                                    Subjective
                                </label>

                                <textarea
                                    name="subjective"
                                    placeholder="Patient's reported symptoms, feelings, concerns..."
                                    value={form.subjective}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Objective
                                </label>

                                <textarea
                                    name="objective"
                                    placeholder="Observable information, behavior, findings..."
                                    value={form.objective}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Assessment
                                </label>

                                <textarea
                                    name="assessment"
                                    placeholder="Clinical assessment..."
                                    value={form.assessment}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Plan
                                </label>

                                <textarea
                                    name="plan"
                                    placeholder="Treatment plan or next steps..."
                                    value={form.plan}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>
                    )}


                    {/* DAP */}
                    {form.noteType === "DAP" && (
                        <div className="clinical-fields">

                            <h4>
                                DAP Documentation
                            </h4>


                            <div className="form-group">

                                <label>
                                    Data
                                </label>

                                <textarea
                                    name="subjective"
                                    placeholder="Session data and observations..."
                                    value={form.subjective}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Assessment
                                </label>

                                <textarea
                                    name="assessment"
                                    placeholder="Clinical assessment..."
                                    value={form.assessment}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Plan
                                </label>

                                <textarea
                                    name="plan"
                                    placeholder="Treatment plan or next steps..."
                                    value={form.plan}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>
                    )}


                    {/* FORM BUTTONS */}
                    <div className="session-form-actions">

                        <button
                            type="submit"
                            className="session-save-btn"
                        >
                            {editingNoteId
                                ? "Update Note"
                                : "Save Note"}
                        </button>

                        <button
                            type="button"
                            className="session-cancel-btn"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            )}


            {/* PREVIOUS NOTES */}
            <div className="session-section-header">

                <h2>
                    Previous Notes
                </h2>

            </div>


            {notes.length === 0 ? (

                <div className="no-notes-card">

                    <h3>
                        No session notes yet
                    </h3>

                    <p>
                        Create a session note to begin
                        documenting this patient's care.
                    </p>

                </div>

            ) : (

                notes.map((note) => (

                    <div
                        className="session-note-card"
                        key={note._id}
                    >

                        <h3>
                            {note.title ||
                                "Untitled Note"}
                        </h3>


                        <div className="session-note-meta">

                            <span
                                className={`note-badge ${
                                    note.visibility ===
                                    "shared"
                                        ? "shared"
                                        : "private"
                                }`}
                            >
                                {note.visibility}
                            </span>

                            <span className="note-badge">
                                {note.noteType}
                            </span>

                            <span className="note-badge">
                                {new Date(
                                    note.createdAt
                                ).toLocaleDateString()}
                            </span>

                        </div>


                        <p className="session-note-content">
                            {note.content}
                        </p>


                        {/* SOAP DETAILS */}
                        {note.noteType === "SOAP" && (
                            <div className="clinical-summary">

                                <div className="clinical-summary-item">

                                    <span>
                                        Subjective
                                    </span>

                                    <p>
                                        {note.subjective ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="clinical-summary-item">

                                    <span>
                                        Objective
                                    </span>

                                    <p>
                                        {note.objective ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="clinical-summary-item">

                                    <span>
                                        Assessment
                                    </span>

                                    <p>
                                        {note.assessment ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="clinical-summary-item">

                                    <span>
                                        Plan
                                    </span>

                                    <p>
                                        {note.plan ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* DAP DETAILS */}
                        {note.noteType === "DAP" && (
                            <div className="clinical-summary">

                                <div className="clinical-summary-item">

                                    <span>
                                        Data
                                    </span>

                                    <p>
                                        {note.subjective ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="clinical-summary-item">

                                    <span>
                                        Assessment
                                    </span>

                                    <p>
                                        {note.assessment ||
                                            "Not provided"}
                                    </p>

                                </div>


                                <div className="clinical-summary-item">

                                    <span>
                                        Plan
                                    </span>

                                    <p>
                                        {note.plan ||
                                            "Not provided"}
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* ACTIONS */}
                        <div className="session-note-actions">

                            <button
                                className="note-edit-btn"
                                onClick={() =>
                                    handleEdit(note)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="note-delete-btn"
                                onClick={() =>
                                    handleDelete(
                                        note._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

export default TherapistSessionNotes;