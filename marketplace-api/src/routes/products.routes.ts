import { Router } from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  myProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// Public
router.get("/", listProducts);

// Seller-only (must be before /:id to avoid "mine" being treated as an id)
router.get("/mine", requireAuth, requireRole("SELLER"), myProducts);
router.post("/", requireAuth, requireRole("SELLER"), createProduct);

// Public detail
router.get("/:id", getProduct);

// Seller-only mutations
router.patch("/:id", requireAuth, requireRole("SELLER"), updateProduct);
router.delete("/:id", requireAuth, requireRole("SELLER"), deleteProduct);

export default router;