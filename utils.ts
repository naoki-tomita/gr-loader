import * as mkdirp from "mkdirp";

export function fill(x: number, length: number): string {
  return `000000000${x}`.substr(-length);
}

export function count(str: string, pattern: string) {
  return str.match(new RegExp(pattern, "gm")).length;
}

export function mkdirpSync(dir: string) {
  return new Promise(ok => mkdirp(dir, () => ok()));
}
