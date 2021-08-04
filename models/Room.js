import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const roomSchema = new mongoose.Schema(
  {
    roomNo: schemaOptions,
    isAvailable: schemaOptions,
    dateTime: { ...schemaOptions, type: Date, default: Date.now() },
    imageUrl: schemaOptions,
    bookedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
