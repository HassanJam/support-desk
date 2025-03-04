import React from 'react';
import { Link } from 'react-router-dom';
import { toggleTicketArchive } from "../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';

function TicketItem({ ticket, is_admin }) {
  const dispatch = useDispatch();

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  console.log(is_admin);

  const handleArchive = () => {
    dispatch(toggleTicketArchive(ticket));
    toast.success(`Ticket ${!ticket.is_archived ? "archived" : "unarchived"}`);
    window.location.reload();
  }

  return (
    <div className='ticket'>
      {is_admin && (
          <div>{ticket?.user?.name}</div>
        )}
      <div>{new Date(ticket.created_at).toLocaleString('en-US', options)}</div>
      <div>{ticket.product}</div>
      <div className={`status status-${ticket.is_archived ? "archived" : ticket.status}`}>{ticket.is_archived ? "archive" : ticket.status}</div>

      <div className='actions'>
        <Link to={`/ticket/${ticket.id}`} className='btn btn-reverse btn-sm'>
          View
        </Link>
        {is_admin && 
          <button onClick={handleArchive} className='btn btn-reverse btn-sm'>
            {ticket.is_archived ? "Unarchive" : "Archive"}
          </button>
        }
      </div>
    </div>
  );
}

export default TicketItem;
