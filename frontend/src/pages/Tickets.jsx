import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import ArchiveButton from "../components/ArchiveButton";

function Tickets() {
  // not best practice, we should change this later
  const [showArchived, setShowArchived] = useState(() => {
    return localStorage.getItem("showArchived") === "true";
  });

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const { tickets, isLoading, isSuccess } = useSelector(
    (state) => state.tickets
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // Unmounting
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess]);

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const handleArchive = () => {
    setShowArchived((showArchived) => {
      const newValue = !showArchived;
      localStorage.setItem("showArchived", newValue);
      return newValue;
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/" />
      {user.is_admin && <ArchiveButton onClick={handleArchive} showArchived={showArchived} />}
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          {user.is_admin && (
              <div>Name</div>
            )}
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets.map((ticket) => (
          (!ticket.is_archived || showArchived) && <TicketItem key={ticket.id} ticket={ticket} is_admin={user.is_admin} />
        ))}
      </div>
    </>
  );
}

export default Tickets;
