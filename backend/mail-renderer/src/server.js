import express from "express";
import mjml2html from "mjml";

import { template } from "./mjmlTemplate";
import { getContext } from "./utils";

const app = express();
app.use(express.json());

const port = 3000;

app.post("/", (req, res) => {
  const load = req.body;

  const context = getContext(load.data);

  const mjml = template(context);
  const html = mjml2html(mjml, { minify: true });

  res.json({ data: html.html });
});

export const start = () => {
  app.listen(port, () =>
    console.log(`Mail renderer server running on port ${port}`)
  );
};
