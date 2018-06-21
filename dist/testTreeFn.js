"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = require("./src/util/Random");
const TreeFunction_1 = require("./src/math/TreeFunction");
const rnd = new Random_1.Random();
const tfun = new TreeFunction_1.TreeFunction(rnd);
const z = tfun.polynomialNode(1, 4);
const x = tfun.polynomialNode(2, 10, z);
console.log(tfun.toTeX(x));
console.log(tfun.toString(x));
//# sourceMappingURL=testTreeFn.js.map