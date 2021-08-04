import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema(
  {
    email: { ...schemaOptions, unique: true },
    password: schemaOptions,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
