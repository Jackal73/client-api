var mongoose = require("mongoose");
var express = require("express");

var path = require("path");
var ticketModel = require("./models/ticket");
var XLSX = require("xlsx");
const { TicketSchema } = require("./model/ticket/Ticket.Schema");

const router = express.Router();

router.all("/", (req, res, next) => {
  next();
});

//connect to db
mongoose
.connect("mongodb+srv://Jackal:Yoshi1988@mernstack.3vtaj.mongodb.net/TikkitIssueTracking", { useNewUrlParser: true })

// .connect("mongodb://localhost:27017/exportExcel", { useNewUrlParser: true })
.then(() => console.log("connected to db"))
.catch((err) => console.log("error in connection", err));

//init app
var app = express();

//set the template engine
app.set("view engine", "ejs");

//set the static folder path
app.use(express.static(path.resolve(__dirname, "public")));

//default page
const getTickets = (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ clientId })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

app.get("/", (req, res) => {
  TicketSchema.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data !== "") {
        res.render("home", { ticket: data });
      } else {
        res.render("home", { data: "" });
      }
    }
  });
});

// - get all tickets for a specific user
app.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getTickets(userId);
    console.log(result);
    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
  if (ticket !== "") {
    res.render("home", { ticket: data });
  } else {
    res.render("home", { ticket: "" });
  }
});

app.get("/exportdata", (req, res) => {
  var wb = XLSX.utils.book_new(); //new workbook
  TicketSchema.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      var temp = JSON.stringify(data);
      temp = JSON.parse(temp);
      var ws = XLSX.utils.json_to_sheet(temp);
      var down = __dirname + "/public/exportdata.xlsx";
      XLSX.utils.book_append_sheet(wb, ws, "sheet1");
      XLSX.writeFile(wb, down);
      res.download(down);
    }
  });
});

// var port = process.env.PORT || 3000;
// app.listen(port, () => console.log("server run at " + port));
