import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import userRouter from "./routes/users.routes.js";
import imageRouter from "./routes/image.routes.js";
import dumpRouter from "./routes/dump.routes.js";

const app = express();

//middleware
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);
app.use(cors());
app.use("/api/images", imageRouter);
app.use("/api/users", userRouter);
app.use("/api/dumps", dumpRouter);

export default app;
