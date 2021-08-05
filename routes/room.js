import { Router } from "express";

import Room from "../models/Room.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

// this route will fetch all the rooms
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(201).json(rooms);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// gets all the rooms which are available for booking
router.get("/rooms/available", async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: "true" });
    res.status(201).json(rooms);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// Creates a new Room
router.post("/room/add", verifyToken, async (req, res) => {
  try {
    const room = new Room({ ...req.body, isAvailable: "true" });
    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// books a room
router.patch("/bookRoom/:roomId", verifyToken, async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findOneAndUpdate(
      { _id: roomId },
      { isAvailable: "false", bookedTo: req.user._id, dateTime: Date.now() },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// checks out from the room
router.patch("/leaveRoom/:roomId", verifyToken, async (req, res) => {
  const { roomId } = req.params;
  const user = req.user._id;

  try {
    const room = await Room.findOne({ _id: roomId });
    if (user !== room.bookedTo.toString())
      return res.status(400).json("You are not the one who booked this room!");

    room.isAvailable = "true";
    room.bookedTo = null;
    const updatedRoom = await room.save();
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
