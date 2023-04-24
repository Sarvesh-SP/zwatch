#!/usr/bin/env node

import welcome from "cli-welcome";
import { helpMsg, parseJson, starter } from "./utils/commonUtils.js";
import meow from "meow";

const { version, description, name } = await parseJson("../package.json");

welcome({
  title: `${name}`,
  tagLine: `by Sarvesh SP`,
  description: `${description}`,
  version: `${version}`,
  bgColor: "#A6D0DD",
  color: "#000000",
  bold: true,
  clear: true,
});

const cli = meow(helpMsg(), {
  importMeta: import.meta,
});

const filename = cli.input[0] || "index.js";

await starter(filename);
