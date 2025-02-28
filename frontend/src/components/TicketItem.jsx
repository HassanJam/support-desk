import React from 'react';
import { Link } from 'react-router-dom';

function TicketItem({ ticket }) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return (
    <div className='ticket'>
      <div>{new Date(ticket.created_at).toLocaleString('en-US', options)}</div>
      <div>{ticket.product}</div>
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      <Link to={`/ticket/${ticket.id}`} className='btn btn-reverse btn-sm'>
        View
      </Link>
    </div>
  );
}

export default TicketItem;