import { Router } from "express";
import {
  getDumps,
  deleteDumps,
  recoveryDumps,
} from "../controllers/dump.controller.js";

const router = Router();

router.get("/", getDumps);
router.delete("/:id", deleteDumps);
router.delete("/recovery/:id", recoveryDumps);

export default router;
