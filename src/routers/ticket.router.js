const express = require("express");
const router = express.Router();
const { insertTicket } = require("../model/ticket/Ticket.model");

router.all("/", (req, res, next) => {

	next();
});

// - create new ticket
router.post('/', async (req, res) => {
	try {
		const{ subject, sender, message } = req.body;

		const ticketObj = {
			clientId: "62487bdf79c03f1de4b0d432",
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

module.exports = router;