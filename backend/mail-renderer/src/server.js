import fs from "fs";

import express from "express";
import mjml2html from "mjml";

import template from "./mjmlTemplates/tableTemplate";
import getContextForTable from "./utils/getContextForTable";
import createNotify from "./utils/createNotify";

const app = express();
app.use(express.json());

const port = 3000;

app.post("/table", (req, res) => {
  const load = req.body;

  const context = getContextForTable(load.data);
  const mjml = template(context);

  const html = mjml2html(mjml, { minify: true });

  res.json({ data: html.html });
});

app.post("/notify", (req, res) => {
  const load = req.body;

  const mjml = createNotify(load);
  const html = mjml2html(mjml, { minify: true });

  res.json({ data: "success" });
});

export const start = () => {
  app.listen(port, () =>
    console.log(`Mail renderer server running on port ${port}`)
  );
};
