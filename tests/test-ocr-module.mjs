import assert from "node:assert/strict";

globalThis.self=globalThis;
const module=await import(`../vendor/tesseract/tesseract.esm.min.js?test=${Date.now()}`);
const createWorker=module.createWorker||module.default?.createWorker;
assert.equal(typeof createWorker,"function");
console.log(JSON.stringify({exports:Object.keys(module),defaultCreateWorker:typeof module.default?.createWorker}));
