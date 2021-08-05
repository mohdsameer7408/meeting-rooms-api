import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const bookingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    time: { ...schemaOptions },
    date: { ...schemaOptions },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
