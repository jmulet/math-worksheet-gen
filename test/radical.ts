import { Radical } from '../src/math/Radical';
import { PolyMonomial } from '../src/math/PolyMonomial';
import { PolyRadical } from '../src/math/PolyRadical'; 
import { Random } from '../src/util/Random';
 
console.log("==================")
console.log("TEST RADICAL CLASS")
console.log("==================")

const r1 = new Radical(2);
const r2 = new Radical(54, 3);
const r3 = new Radical(250, 3, -5);

console.log("Numeric radicals........................................");
console.log("To TeX")
console.log(r1.toTeX(), ' | ', r2.toTeX(), ' | ', r3.toTeX())
console.log("simplified: ", r1.simplify().toTeX(), ' | ', r2.simplify().toTeX(), ' | ', r3.simplify().toTeX())

console.log("To String")
console.log(r1.toString(), ' | ', r2.toString(), ' | ', r3.toString())

console.log("")
console.log("Operations")
console.log("r1*r3 = ", r1.multiply(r3).simplify().toTeX())
console.log("r1/r3 = ", r1.divide(r3).simplify().toTeX())
console.log("r1^6 = ", r1.power(6).simplify().toTeX())
console.log("root[6]{r1} = ", r1.root(6).simplify().toTeX())

console.log("Reduce")
console.log("r1 + r2 + r3 = ", new PolyRadical([r1, r2, r3]).simplify().toTeX());


console.log("Algebraic radicals........................................");
const rnd = new Random();
const r4 = rnd.radical({simplificable: true, algebraic:true });
const r5 = rnd.radical({simplificable: true, algebraic:true });
const r6 = rnd.radical({simplificable: true, algebraic:true });

console.log("To TeX")
console.log(r4.toTeX(), ' | ', r5.toTeX(), ' | ', r5.toTeX())
console.log("simplified: ", r4.simplify().toTeX(), ' | ', r5.simplify().toTeX(), ' | ', r6.simplify().toTeX())
console.log("Enter coefficients")
console.log("simplified: ", r4.enterCoefficient().toTeX(), ' | ', r5.enterCoefficient().toTeX(), ' | ', r6.enterCoefficient().toTeX())