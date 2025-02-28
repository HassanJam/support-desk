const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  let tickets;
  if (user.is_admin) {
    // If user is an admin, return all tickets with user details
    tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email'], // Select only name and email
          as: 'user', // Optional alias, if you've set one in your association
        },
      ],
    });
  } else {
    // Otherwise, return only their own tickets with user details
    tickets = await Ticket.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
          as: 'user', // Optional alias
        },
      ],
    });
  }

  res.status(200).json(tickets);
});

const getTicket = asyncHandler(async (req, res) => {
  console.log("getTicket - Attempting to find ticket");

  // Convert req.params.id to a number for consistency
  const ticketId = parseInt(req.params.id, 10);
  console.log(
    "getTicket - Request params.id:",
    req.params.id,
    "(type:",
    typeof req.params.id,
    ")"
  );
  console.log(
    "getTicket - Converted ticketId:",
    ticketId,
    "(type:",
    typeof ticketId,
    ")"
  );

  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'], // Select only necessary fields
        as: 'user', // Match the alias defined in associations
      },
    ],
  });

  console.log("getTicket - Ticket found:", ticket ? ticket.toJSON() : "null");
  console.log(
    "getTicket - ticket.id:",
    ticket ? ticket.id : "N/A",
    "(type:",
    ticket ? typeof ticket.id : "N/A",
    ")"
  );

  if (!ticket) {
    console.log("getTicket - Ticket not found");
    res.status(404);
    throw new Error("Ticket not found");
  }
  console.log("here");

  // Get the authenticated user's ID
  const requestingUserId = Number(req.user.id);
  console.log("here");

  console.log(
    "getTicket - requestingUserId:",
    requestingUserId,
    "(type:",
    typeof requestingUserId,
    ")"
  );
  console.log(
    "getTicket - ticket.user_id:",
    ticket.user_id,
    "(type:",
    typeof ticket.user_id,
    ")"
  );

  // Check if the ticket belongs to the requesting user
  if (Number(ticket.user_id) !== Number(requestingUserId) && !req.user.is_admin) {
    console.log("getTicket - User not authorized");
    res.status(401);
    throw new Error("User not authorized");
  }

  console.log("getTicket - Sending response");
  res.status(200).json(ticket);
  console.log("getTicket - Response sent");
});

const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;
  console.log("createTicket - Request body:", req.body);

  if (!product || !description) {
    console.log("createTicket - Missing product or description");
    res.status(400);
    throw new Error("Please provide a product and description");
  }

  console.log(
    "createTicket - User ID from token:",
    req.user ? req.user.id : "undefined"
  );
  const user = await User.findByPk(req.user.id);
  console.log(
    "createTicket - User lookup result:",
    user ? user.toJSON() : "No user found"
  );

  if (!user) {
    console.log("createTicket - User not found");
    res.status(401);
    throw new Error("User not found");
  }

  console.log("createTicket - Attempting to create ticket");
  const ticket = await Ticket.create({
    product,
    description,
    user_id: req.user.id, // Ensure this matches your model (userId, not user_id)
    status: "new",
  });
  console.log("createTicket - Ticket created:", ticket.toJSON());

  console.log("createTicket - Sending response");
  res.status(201).json(ticket);
});
const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  if (ticket.user_id !== req.user.id && !req.user.is_admin) {
    res.status(401);
    throw new Error("Not authorized");
  }
  await ticket.destroy();
  res.status(200).json({ success: true });
});

const updateTicket = asyncHandler(async (req, res) => {
  console.log("close ticket ");

  const user = await User.findByPk(req.user.id);
  console.log("user in close ticket ", user);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  console.log("req.params.id in close ticket", req.params.id);
  const ticket = await Ticket.findByPk(req.params.id);
  console.log("ticket in close ticket", ticket);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  if (ticket.user_id !== req.user.id && !req.user.is_admin) {
    res.status(401);
    throw new Error("Not authorized");
  }
  console.log("here")
  const updatedTicket = await ticket.update(req.body);
  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
