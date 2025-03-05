import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const { name, email } = user;
  // const [name] = useState(user.name);
  // const [email] = useState(user.email);
  const [issue, setIssue] = useState("Client Regarding");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate("/tickets");
    }
  }, [dispatch, isError, isSuccess, navigate, message]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createTicket({ issue, description }));
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/" />
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input type="text" className="form-control" value={name} disabled />
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Customer Email</label>
          <input type="text" className="form-control" value={email} disabled />
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="issue">Issue</label>
            <select
              name="issue"
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >
              <option value="Client Regarding">Client Regarding</option>
              <option value="Client Biometric">Client Biometric</option>
              <option value="External Extension">External Extension</option>
              <option value="Network">Network</option>
              <option value="Internet">Internet</option>
              <option value="Phone">Phone</option>
              <option value="Software Training">Software Training</option>
              <option value="Mobile Application">Mobile Application</option>
              <option value="Video Call">Video Call</option>
              <option value="Audio Minutes">Audio Minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              name="description"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NewTicket;
