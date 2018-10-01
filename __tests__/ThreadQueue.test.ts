import { ThreadQueue } from "../ThreadQueue";

const queue = new ThreadQueue(3);

async function wait(ms: number) {
  return new Promise(x => setTimeout(x, ms));
}

function task(id: number) {
  return async () => {
    const time = Math.random() * 5 * 1000;
    console.log(`run: ${id} in ${time}ms...`);
    await wait(time);
    console.log(`end: ${id}`);
  };
}

(async () => {
  queue.push(task(1));
  queue.push(task(2));
  queue.push(task(3));
  queue.push(task(4));
  queue.push(task(5));
  queue.push(task(6));
  queue.push(task(7));
  queue.push(task(8));
  queue.push(task(9));
  await queue.run();
  console.log("the end");
})();
