const express = require("express");
const router = express.Router();
const { insertTicket, getTickets, getTicketById, updateClientReply } = require("../model/ticket/Ticket.model");
const { userAuthorization } = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {

	next();
});

// - create new ticket
router.post('/', userAuthorization, async (req, res) => {
	try {
		const{ subject, sender, message } = req.body;

		const userId = req.userId;

		const ticketObj = {
			clientId: userId,
			subject,
			conversations: [
				{
					sender,
					message,
				},
			],
		};

		const result = await insertTicket(ticketObj);

		if (result._id) {
			return res.json({
				status: "success",
				message: "New ticket has been created",
			});
		}
		res.json({
			status: "error",
			message: "Unable to create a ticket, please try again later",
		});
	} catch (error) {
		res.json({
			status: "error",
			message: error.message
		});
	}
});

// - get all tickets for a specific user
router.get('/', userAuthorization, async (req, res) => {
	try {

		const userId = req.userId;

		const result = await getTickets(userId);

		return res.json({
			status: "success",
			result
		});

	} catch (error) {
		res.json({
			status: "error",
			message: error.message
		});
	}
});

// - get ticket by ticket _id
router.get('/:_id', userAuthorization, async (req, res) => {

	try {
		const {_id} = req.params;
		const clientId = req.userId;
		const result = await getTicketById(_id, clientId);

		return res.json({
			status: "success",
			result
		});

	} catch (error) {
		res.json({
			status: "error",
			message: error.message
		});
	}
});

// - update reply message from client
router.put('/:_id', userAuthorization, async (req, res) => {

	try {
		const {message, sender} = req.body;
		const {_id} = req.params;
		const clientId = req.userId;
		const result = await updateClientReply({_id, message, sender});

		if (result._id) {
			return res.json({
				status: "success",
				message: "Message was updated successfully",
			});
		}
		res.json({
			status: "error",
			message: "Unable to update message, please try again later",
		});

	} catch (error) {
		res.json({
			status: "error",
			message: error.message
		});
	}
});

module.exports = router;