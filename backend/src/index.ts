import userRouter from "./routes/user";
import cors from "cors";
import express from "express";
import eventRouter from "./routes/event";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin:true,
  credentials:true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('origin'));
  next();
});
app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/event', eventRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
