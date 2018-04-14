import { lcm } from 'mathjs';
import { Monomial } from './Monomial';
import { Power } from './Power';

export class Arithmetics {
    static lcm(a: number | Monomial, b: number | Monomial): number | Monomial {
        if (typeof(a)==="number" && typeof(b)==="number") {
            return lcm(a, b);
        } else if (typeof(a)==="number") {
            const bcoef = (<Monomial> b).coef;
            return new Monomial( lcm(a, bcoef), (<Monomial> b).literals);
        } else {
            const aMonomial = <Monomial> a;
            const bMonomial = <Monomial> b;
            return new Monomial(lcm(aMonomial.coef, bMonomial.coef), Power.lcm(aMonomial.literals, bMonomial.literals));
        }
    }
}