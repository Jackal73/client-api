const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectID
  },
  fileNo: {
    type: String,
    maxlength: '15',
    required: true,
    default: ''
  },
  closeDate: {
    type: Date,
    required: true,
    default: ''
  },
  fundDate: {
    type: Date,
    required: true,
    default: ''
  },
  dealType: {
    type: String,
    possibleValues: ['Buyer', 'Seller', 'Buyer/Seller', 'Refi'],
    required: true,
    default: ''
  },
  closerOne: {
    type: String,
    maxlength: '25',
    required: true,
    default: ''
  },
  commishClOne: {
    type: Number,
    maxlength: '10',
    required: true,
    default: ''
  },
  closerTwo: {
    type: String,
    maxlength: '50',
    required: false,
    default: ''
  },
  commishClTwo: {
    type: Number,
    maxlength: '10',
    required: false,
    default: ''
  },
  mobCloser: {
    type: String,
    maxlength: '50',
    required: false,
    default: ''
  },
  mobFee: {
    type: Number,
    maxlength: '10',
    required: false,
    default: ''
  },
  overage: {
    type: Number,
    maxlength: 10,
    required: true,
    default: ''
  },
  processorOne: {
    type: String,
    maxlength: 50,
    required: true,
    default: ''
  },
  commishPrOne: {
    type: Number,
    maxlength: 10,
    required: true,
    default: ''
  },
  processorTwo: {
    type: String,
    maxlength: 50,
    required: false,
    default: ''
  },
  commishPrTwo: {
    type: Number,
    maxlength: 10,
    required: false,
    default: ''
  },
  clientRefOne: {
    type: String,
    maxlength: 50,
    required: true,
    default: ''
  },
  clientRefTwo: {
    type: String,
    maxlength: 50,
    required: false,
    default: ''
  },
  realAgentOne: {
    type: String,
    maxlength: 50,
    minlength: 2,
    required: true,
    default: ''
  },
  realAgentTwo: {
    type: String,
    maxlength: 50,
    required: false,
    default: ''
  },
  lnOfficer: {
    type: String,
    maxlength: 50,
    required: true,
    default: ''
  },
  salesRepOne: {
    type: String,
    maxlength: 50,
    required: true,
    default: ''
  },
  salesTypeOne: {
    type: String,
    possibleValues: ['Buyer', 'Seller', 'Buyer/Seller'],
    required: true,
    default: ''
  },
  salesRepTwo: {
    type: String,
    maxlength: 50,
    required: false,
    default: ''
  },
  salesTypeTwo: {
    type: String,
    possibleValues: ['Buyer', 'Seller', 'Buyer/Seller'],
    required: false,
    default: ''
  },
  discount: {
    type: String,
    possibleValues: ['Yes', 'No'],
    required: true,
    default: ''
  },
  discountApproval: {
    type: String,
    maxlength: 50,
    required: false,
    default: ''
  },
  freedomCheck: {
    type: Number,
    maxlength: 10,
    required: true,
    default: ''
  },
  message: {
    type: String,
    maxlength: 1000,
    required: false,
    default: ''
  },

});

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema),
};