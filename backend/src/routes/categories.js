import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getCategories } from "../utils/categorizer.js";

const router = Router();

router.use(auth);

router.get("/", (_req, res) => {
  res.json({ categories: getCategories() });
});

export default router;
