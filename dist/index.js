"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = require("request-promise");
const utils_1 = require("./utils");
const ProgressBar = require("progress");
const fs_1 = require("fs");
const path_1 = require("path");
const ThreadQueue_1 = require("./ThreadQueue");
const Logger_1 = require("./Logger");
const GRConnector_1 = require("./GRConnector");
const dst = process.argv[2];
async function listFiles() {
    const result = await request_promise_1.get("http://192.168.0.1/_gr/objs");
    return JSON.parse(result);
}
function dateFormat(date, format = "yyyy-mm-dd") {
    format = format.replace("yyyy", utils_1.fill(date.getFullYear(), 4));
    format = format.replace("mm", utils_1.fill(date.getMonth() + 1, 2));
    format = format.replace("dd", utils_1.fill(date.getDate(), 2));
    return format;
}
async function loadFiles(dirs) {
    Logger_1.log(`dirs - ${dirs.length}`);
    const datesSet = new Set();
    const photos = [];
    dirs.forEach(d => d.files.forEach(f => {
        const date = dateFormat(new Date(f.d));
        photos.push({ dir: d.name, name: f.n, date });
        datesSet.add(date);
    }));
    const dates = [...datesSet];
    Logger_1.log(`dates - ${dates.length}`);
    Logger_1.log(`photos - ${photos.length}`);
    // create dir.
    for (let i = 0; i < dates.length; i++) {
        Logger_1.log(`creating folder: ${path_1.join(dst, dates[i])}`);
        await utils_1.mkdirpSync(path_1.join(dst, dates[i]));
    }
    // init progress
    const progress = new ProgressBar("copying [:bar] :current/:total :percent :etas", photos.length);
    progress.render({ bar: 0, current: 0, percent: 0, etas: "N/A" });
    const queue = new ThreadQueue_1.ThreadQueue(5);
    // fetch file.
    for (let i = 0; i < photos.length; i++) {
        queue.push(async () => {
            return new Promise(ok => {
                request_promise_1.get(`http://192.168.0.1/v1/photos/${photos[i].dir}/${photos[i].name}`)
                    .pipe(fs_1.createWriteStream(path_1.join(dst, photos[i].date, photos[i].name)))
                    .on("close", () => (progress.tick(), ok()));
            });
        });
    }
    queue.run();
}
(async () => {
    await GRConnector_1.connectToGR();
    const files = await listFiles();
    await loadFiles(files.dirs.filter(d => d.name !== "101__TSB"));
})();
