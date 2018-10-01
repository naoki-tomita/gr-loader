import { get } from "request-promise";
import { fill, mkdirpSync } from "./utils";
import * as ProgressBar from "progress";
import { createWriteStream } from "fs";
import { join } from "path";
import { ThreadQueue } from "./ThreadQueue";
import { log } from "./Logger";
import { connectToGR } from "./GRConnector";

const dst = process.argv[2];
if (!dst) {
  throw Error("You must specify destination path.");
}

async function listFiles() {
  const result = await get("http://192.168.0.1/_gr/objs");
  return JSON.parse(result);
}

function dateFormat(date: Date, format: string = "yyyy-mm-dd") {
  format = format.replace("yyyy", fill(date.getFullYear(), 4));
  format = format.replace("mm", fill(date.getMonth() + 1, 2));
  format = format.replace("dd", fill(date.getDate(), 2));
  return format;
}

async function loadFiles(
  dirs: Array<{ name: string; files: Array<{ n: string; d: string }> }>,
) {
  log(`dirs - ${dirs.length}`);
  const datesSet = new Set<string>();
  const photos: Array<{ dir: string; name: string; date: string }> = [];
  dirs.forEach(d =>
    d.files.forEach(f => {
      const date = dateFormat(new Date(f.d));
      photos.push({ dir: d.name, name: f.n, date });
      datesSet.add(date);
    }),
  );
  const dates = [...datesSet];
  log(`dates - ${dates.length}`);
  log(`photos - ${photos.length}`);

  // create dir.
  for (let i = 0; i < dates.length; i++) {
    log(`creating folder: ${join(dst, dates[i])}`);
    await mkdirpSync(join(dst, dates[i]));
  }

  // init progress
  const progress = new ProgressBar(
    "copying [:bar] :current/:total :percent :etas",
    photos.length,
  );
  progress.render({ bar: 0, current: 0, percent: 0, etas: "N/A" });

  const queue = new ThreadQueue(5);
  // fetch file.
  for (let i = 0; i < photos.length; i++) {
    queue.push(async () => {
      return new Promise(ok => {
        get(`http://192.168.0.1/v1/photos/${photos[i].dir}/${photos[i].name}`)
          .pipe(createWriteStream(join(dst, photos[i].date, photos[i].name)))
          .on("close", () => (progress.tick(), ok()));
      });
    });
  }
  queue.run();
}

(async () => {
  await connectToGR();
  const files = await listFiles();
  await loadFiles(files.dirs.filter(d => d.name !== "101__TSB"));
})();
