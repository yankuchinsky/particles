#!/bin/sh
npm i
cd wasm-phys
wasm-pack build
cd ../
npm run build