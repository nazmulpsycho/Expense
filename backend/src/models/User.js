import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    avatar: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt" } }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);
