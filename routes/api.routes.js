const express = require("express");
const { Usermodel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticate } = require("../middleware/authenticate.middleware");
const { Flightmodel } = require("../models/flight.model");
const { Bookingmodel } = require("../models/booking.model");
const apiRouter = express.Router();

// User-System-------------------------------------------------------->

apiRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exist_user = await Usermodel.find({ email: email });
    console.log(exist_user);
    if (exist_user.length == 1) {
      res.status(500).send({ msg: "User already exists please try to login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(400).send({ err: err.message });
          console.log(err);
        } else {
          const new_user = new Usermodel({
            name,
            email,
            password: hash,
          });
          await new_user.save();
          res.status(201).send({ msg: `${name} register successfully` });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

apiRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email });
    const hashed_pass = user.password;
    if (user) {
      bcrypt.compare(password, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id }, "sitansu");
          res.status(201).send({ msg: "Login Successfull", token: token });
        } else {
          res.status(400).send({ msg: "Login Failed" });
        }
      });
    } else {
      res.status(400).send({ msg: "Wrong Inputs" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// Flight-system---------------------------------------------------------->

apiRouter.get("/flights", authenticate, async (req, res) => {
  try {
    const flights = await Flightmodel.find();
    if (flights.length > 0) {
      res.status(200).send(flights);
    } else {
      res.status(400).send({ msg: "No Flights" });
    }
  } catch (error) {}
});

apiRouter.get("/flights/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const flight = await Flightmodel.findById({ _id: id });
    res.status(200).send({ flight: flight });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

apiRouter.post("/flights", authenticate, async (req, res) => {
  const {
    airline,
    flightNo,
    departure,
    arrival,
    departureTime,
    arrivalTime,
    seats,
    price,
  } = req.body;
  try {
    const new_flight = new Flightmodel({
      airline,
      flightNo,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      seats,
      price,
    });

    await new_flight.save();
    res.status(201).send({ msg: `${flightNo} added Successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

apiRouter.delete("/flights/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const exist_flight = await Flightmodel.findOne({ _id: id });
    // console.log(exist_flight);

    if (exist_flight) {
      const flight = await Flightmodel.findByIdAndDelete({ _id: id });
      res.status(202).send({
        msg: `Flight no: ${exist_flight.flightNo} Deleted successfull`,
      });
    } else {
      res.status(400).send({ msg: "Flight Does not Exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

apiRouter.patch("/flights/:id", authenticate, async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  try {
    const exist_flight = await Flightmodel.findOne({ _id: id });
    if (exist_flight) {
      const flight = await Flightmodel.findByIdAndUpdate({ _id: id }, payload);
      res.status(204).send({ msg: `Flight id: ${id} Updated Successfully` });
    } else {
      res.status(400).send({ msg: `Flight with id: ${id} does not exists` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
apiRouter.put("/flights/:id", authenticate, async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  try {
    const exist_flight = await Flightmodel.findOne({ _id: id });
    if (exist_flight) {
      const flight = await Flightmodel.findByIdAndUpdate({ _id: id }, payload);
      res.status(204).send({ msg: `Flight id: ${id} Updated Successfully` });
    } else {
      res.status(400).send({ msg: `Flight with id: ${id} does not exists` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// Bookin-System---------------------------------------------->

apiRouter.post("/booking", authenticate, async (req, res) => {
  try {
    const flightid = req.body.flight;
    const userid = req.body.user;
    console.log(flightid,userid)
    const flight = await Flightmodel.findOne({ _id: flightid });

    if (flight) {
      const booked = await Bookingmodel.find({
        flight: flightid,
        user: userid,
      });

      if (booked) {
        res.status(400).send({ msg: "User already booked the flight" });
      } else {
        const booked_flight = new Bookingmodel({
          flight: flightid,
        });
        await booked_flight.save();
        res.status(201).send({
          msg: `User of ${userid} booked the flight of id: ${flightid}`,
        });
      }
    } else {
      res.status(400).send({ msg: "Flight Doesnot Exists" });
    }
    res.send(flightid);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

apiRouter.get("/new", (req, res) => {
  const date = new Date();
  res.send(date);
});

module.exports = {
  apiRouter,
};

// {
//   "airline": "Indigo",
//   "flightNo": "A5310",
//   "departure": "",
//   "arrival": "",
//   "departureTime":"",
//   "arrivalTime": "",
//   "seats": 200,
//   "price": 5000
// }
