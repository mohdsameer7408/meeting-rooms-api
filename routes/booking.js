import { Router } from "express";

import verifyToken from "../config/verifyToken.js";
import Booking from "../models/Booking.js";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "room user",
      "-password -__v"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.post("/book/room", verifyToken, async (req, res) => {
  const { roomId, time, date } = req.body;
  try {
    const booking = new Booking({
      room: roomId,
      user: req.user._id,
      time,
      date: new Date(date).toDateString(),
    });
    const confirmedBooking = await booking.save();
    res.status(201).json(confirmedBooking);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
