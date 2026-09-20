import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    dailyBudget: { type: Number, default: 0 },
    weeklyBudget: { type: Number, default: 0 },
    monthlyBudget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
