import { Random } from "./src/util/Random";
import { TreeFunction } from "./src/math/TreeFunction";

const rnd = new Random();


const tfun = new TreeFunction(rnd);
const z = tfun.polynomialNode(1,4);
const x = tfun.polynomialNode(2, 10, z);
console.log( tfun.toTeX(x));
console.log( tfun.toString(x));