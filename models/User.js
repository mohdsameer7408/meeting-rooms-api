import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema(
  {
    name: { ...schemaOptions },
    email: { ...schemaOptions, unique: true },
    userType: { ...schemaOptions },
    password: schemaOptions,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
