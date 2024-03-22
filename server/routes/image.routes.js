import { Router } from "express";
import {
  createImage,
  deleteImageback,
  getImages,
  updateImage,
} from "../controllers/image.controller.js";

const router = Router();

router.get("/", getImages);
router.post("/", createImage);
router.delete("/:id", deleteImageback);
router.put("/:id", updateImage);

export default router;
