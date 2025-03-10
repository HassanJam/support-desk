import { useSelector } from "react-redux";

function NoteItem({ note }) {
  const { user } = useSelector((state) => state.auth);
  console.log("note data from note item component ", note);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div
      className="note"
      style={{
        backgroundColor: note?.user?.is_admin ? "rgba(0,0,0,0.7)" : "#fff",
        color: note?.user?.is_admin ? "#fff" : "#000",
      }}
    >
      <h4>
        Note from {note?.user?.is_admin ? <span>Staff</span> : <span>{note?.user?.name}</span>}
      </h4>
      <p>{note.text}</p>
      <div className="note-date">
        {new Date(note.created_at).toLocaleString("en-US", options)}
      </div>
    </div>
  );
}

export default NoteItem;
