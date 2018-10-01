"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThreadQueue {
    constructor(max = 1) {
        this.threadPool = [];
        this.tasks = [];
        this.max = max || 1;
    }
    push(thread) {
        this.tasks.push(thread);
    }
    async run() {
        while (this.threadPool.length < this.max) {
            this.runThreadPool();
        }
        return new Promise((ok, ng) => {
            this.resolve = ok;
            this.reject = ng;
        });
    }
    runThreadPool() {
        if (this.tasks.length === 0) {
            if (this.threadPool.length === 0) {
                this.resolve();
            }
            return;
        }
        const task = this.tasks.shift();
        this.threadPool.push(task);
        task()
            .then(() => (this.removePool(task), this.runThreadPool()))
            .catch(e => this.reject(e));
    }
    removePool(thread) {
        this.threadPool.splice(this.threadPool.indexOf(thread), 1);
    }
}
exports.ThreadQueue = ThreadQueue;
