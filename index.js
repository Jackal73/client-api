const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const excel = require("exceljs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Jackal:Yoshi1988@mernstack.3vtaj.mongodb.net/TikkitIssueTracking", { useNewUrlParser: true,
useUnifiedTopology: true, });



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected to db!");
});

//Ticket schema
const ticketSchema = new mongoose.Schema({
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

const ticket = mongoose.model("ticket", ticketSchema);

...

//downloadFile post route
app.post("/downloadFile", function (req, res) {

  //retrieve all tickets in database and store it as result array
  ticket.find({}, function (err, results) {
    let modifiedResult = results.reverse();

    if (err) {
      console.log("Could not retrieve data from database " + err);
      res.status(400);
    } else {
      //create a new excel workbook, a worksheet and set its properties.
      const workbook = new excel.Workbook();
      const sheet = workbook.addWorksheet("FIBRE_SWITCH", {
        properties: {
          tabColor: { argb: "FFc0000" },
        },
      });
      sheet.columns = [
        { header: "CLOSER ID", key: "clientId", width: 20 },
        { header: "FILE NO", key: "fileNo", width: 15 },
        { header: "CLOSE DATE", key: "closeDate", width: 15 },
        { header: "FUND DATE", key: "fundDate", width: 15 },
        { header: "DEAL TYPE", key: "dealType", width: 15 },
        { header: "CLOSER ONE", key: "closerOne", width: 15 },
        { header: "COMM CL ONE", key: "commishClOne", width: 10 },
        { header: "CLOSER TWO", key: "closerTwo", width: 15 },
        { header: "COMMISH CLOS TWO", key: "commishClTwo", width: 10 },
        { header: "MOB CLOSER", key: "mobCloser", width: 15 },
        { header: "MOB FEE", key: "mobFee", width: 10 },
        { header: "OVERAGE", key: "overage", width: 10 },
        { header: "PROCESSOR ONE", key: "processorOne", width: 15 },
        { header: "COMMISH PR ONE", key: "commishPrOne", width: 10 },
        { header: "PROCESSOR TWO", key: "processorTwo", width: 15 },
        { header: "COMMISH PR TWO", key: "commishPrTwo", width: 10 },
        { header: "CLIENT REF ONE", key: "clientRefOne", width: 15 },
        { header: "CLIENT REF TWO", key: "clientRefTwo", width: 15 },
        { header: "REAL AGENT ONE", key: "realAgentOne", width: 15 },
        { header: "REAL AGENT TWO", key: "realAgentTwo", width: 15 },
        { header: "LOAN OFFICER", key: "lnOfficer", width: 15 },
        { header: "SALES REP ONE", key: "salesRepOne", width: 15 },
        { header: "SALES TYP ONE", key: "salesTypeOne", width: 15 },
        { header: "SALES REP TWO", key: "salesRepTwo", width: 15 },
        { header: "SALES TYP TWO", key: "salesTypeTwo", width: 15 },
        { header: "DISCOUNT", key: "discount", width: 10 },
        { header: "DISC APPROVAL", key: "discountApproval", width: 15 },
        { header: "FREEDOM CHECK", key: "freedomCheck", width: 10 },
        { header: "MESSAGE", key: "message", width: 100 },
      ];

      //write the data from the database to the excel worksheet cells.
      sheet.addRows(modifiedResult);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "OFC REPORT.xlsx"
      );

      //Download workbook.
      return workbook.xlsx.write(res).then(function () {
        console.log("Download success");
        res.status(200);
      });
    }
  });
});

app.listen(3001, function () {
  console.log("Server started at port 3001");
});