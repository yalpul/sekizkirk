import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send({ message: "hello changed again" });
});

export const start = () => {
  app.listen(port, () =>
    console.log(`Mail renderer server running on port ${port}`)
  );
};
