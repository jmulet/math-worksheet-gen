import { Monomial } from "../math/Monomial";
import { Fraction } from "../math/Fraction";

export function performProduct(a: number | Fraction | Monomial, b: number | Fraction | Monomial) {
    if (typeof(a)==="number" && typeof(b)==="number") {
        return a*b;
    } else if ((a instanceof Fraction) && (b instanceof Fraction)) {
        return a.multiply(b);
    } else if (typeof(a)==="number" && (b instanceof Fraction)) {
        return b.times(a);
    } else {
        return performProduct(b, a);
    }
}

export function performPower(a: number | Fraction, n: number): number | Fraction {
    if (typeof(a) === "number") {
        return Math.pow(a, n);
    } else {
        return (<Fraction> a).power(n);
    }
}
 