import { useDispatch, useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import {
  getNotes,
  createNote,
} from "../features/notes/noteSlice";
import Spinner from "../components/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const user = useSelector((state) => state.auth.user);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  console.log(window.location.href);
  const { ticket_id } = useParams();
  console.log("ticket_id from frontend", ticket_id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    console.log("dispatching ticket with id ", ticket_id);
    dispatch(getTicket(ticket_id));
    dispatch(getNotes(ticket_id));
    // eslint-disable-next-line
  }, [isError, message, ticket_id]);
  console.log("successfully got Ticket", ticket);

  console.log("successfully got Notes", notes);

  if (isLoading || notesIsLoading) return <Spinner />;

  if (isError) {
    return <h3>Something went wrong</h3>;
  }

  // Close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticket_id));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };

  // Open/Close Modal
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Create Note Submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ ticketId: ticket_id, noteText }));
    closeModal();
  };

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket.id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        {
          user.is_admin && (
            <>
              <h2>
                Created By: {ticket.user.name}
              </h2>
              <h2>
                Email: {ticket.user.email}
              </h2>    
            </>)
        }        
        <h3>
          Date Submitted:{" "}
          {new Date(ticket.created_at).toLocaleString("en-US", options)}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== "close" && (
        <button onClick={openModal} className="btn">
          <FaPlus /> Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== "close" && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
