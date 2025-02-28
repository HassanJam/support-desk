const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Note = require("../models/noteModel");
const Ticket = require("../models/ticketModel");

const getNotes = asyncHandler(async (req, res) => {
  console.log("initiating getNotes");
  console.log("req.params.ticket_id in notes", req.params.ticketId);
  const user = await User.findByPk(req.user.id);
  // console.log("user", user);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findByPk(req.params.ticketId);
  console.log("ticket in notes", ticket);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  if (ticket.user_id !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  console.log("getting notes");
  const notes = await Note.findAll({
    where: { ticket_id: req.params.ticketId },
    logging: console.log,
  }); // Changed to ticketId  console.log("notes get notes ", notes);
  console.log("sending notes");
  res.status(200).json(notes);
  console.log("notes sent");
});

const addNote = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  console.log("req params inside add note", req.params);
  console.log("inside add note");
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  console.log("user inside add note", user);

  const ticket = await Ticket.findByPk(req.params.ticketId);
  console.log("ticket inside add note", ticket);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  if (ticket.user_id !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const note = await Note.create({
    ticket_id: req.params.ticketId,
    text: req.body.text,
    is_staff: false,
    user_id: req.user.id,
  });
  console.log("here inside add note");

  res.status(200).json(note);
  console.log("created note ")
});

module.exports = {
  getNotes,
  addNote,
};
