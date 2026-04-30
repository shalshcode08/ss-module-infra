import express from "express";

const app = express();
const PORT = process.env.APP_API_PORT;

app.use(express.json());
app.use("/api/v1", () => {
  console.log("this is testing");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
