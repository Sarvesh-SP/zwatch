import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import debounce from "lodash.debounce";
import chokidar from "chokidar";
import { spawn } from "child_process";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parseJson = async (file_name) => {
  const buffer = await fs.readFile(path.join(__dirname, `${file_name}`));
  const data = JSON.parse(buffer);

  return file_name === "../package.json" ? data : data[0];
};

const helpMsg = () => {
  const da = `
USAGE

    zwatch [filename]

ARGUMENTS

    [filename]    Name of the file to execute   optional

GLOBAL OPTIONS

    --help    Display help
`;
  return da;
};

const starter = async (filename) => {
  try {
    let proc;

    const start = debounce(() => {
      if (proc) {
        proc.kill();
      }

      console.log(chalk.blue.bold(">>>>>>>>> Starting Process..."));
      proc = spawn("node", [filename], { stdio: "inherit" });
    }, 100);

    const change = debounce((path) => {
      console.log(`File ${path} changed`);
    });

    //To check if file exists
    await fs.access(filename);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  } catch (err) {
    console.error(`Could'nt find the file ${filename}`);
  }
};

export { parseJson, helpMsg, starter };
