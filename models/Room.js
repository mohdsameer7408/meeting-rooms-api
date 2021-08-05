import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const roomSchema = new mongoose.Schema(
  {
    name: schemaOptions,
    description: schemaOptions,
    dateTime: schemaOptions,
    imageUrl: schemaOptions,
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
