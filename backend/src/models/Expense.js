import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expenseName: { type: String, required: true, trim: true, maxlength: 200 },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true, maxlength: 2000, default: "" },
    receipt: { type: String, trim: true, default: "" },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

expenseSchema.index({ userId: 1, date: 1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
