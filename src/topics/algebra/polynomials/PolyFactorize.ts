import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';
import { Polynomial } from '../../../math/Polynomial';

@WsGenerator({
    category: "algebra/polynomial/factorize",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "minDegree",
            defaults: 2,
            description: "Minimal degree of the generated polynomial"
        },
        {
            name: "maxDegree",
            defaults: 10,
            description: "Maximum degree of the generated polynomial"
        },
        {
            name: "allowFractions",
            defaults: false,
            description: "Allow rational roots, so factor is of the form (ax+b)"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity. From 0-2. 0= factoritzable using identities, with >1 includes irreductible polynomials"
        } 
    ]
})
export class PolyFactorize implements QuestionGenInterface {

    answer: any;
    question: any; 
    
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 7;
        const complexity = qGenOpts.question.complexity || 0;
        const minDegree = qGenOpts.question.minDegree || 2;
        const maxDegree = qGenOpts.question.maxDegree || 4;
    
        let roots: Numeric[];
        
        if (complexity === 0) {
            const coin = rnd.intBetween(0, 1);
            const a = rnd.numericBetweenNotZero(-r, r);
            const zeroes = new Array(rnd.intBetween(0, 2)).fill(0).map(e=> Numeric.fromNumber(e));
            if (coin === 0) {
                roots = [a, a, ...zeroes];
            } else {
                roots = [a, a.oposite(), ...zeroes];
            }
        }  else {

            const numRoots = rnd.intBetween(minDegree, maxDegree);
            roots = rnd.intList(numRoots, r).map( (e) => Numeric.fromNumber(e) );
            if (qGenOpts.question.allowFractions) {
                // At most two rational roots are allowed
                const numFrac = rnd.intBetween(1, 2);
                for (let i=0; i<numFrac; i++) {
                    roots[i] = rnd.fractionBetweenNotZero(-r, r);  
                }
            }             
        }
        
        const poly = Polynomial.fromRoots(roots);
      
        this.question = poly.toTeX();
        this.answer = poly.toFactorForm();

        // Include irreductible polynomial
        if (complexity > 1) {
            const c0 = rnd.intBetween(1, r);
            const polyIrreductible = new Polynomial([1, 0, c0]);
            this.question = poly.multiply(polyIrreductible).toTeX();
            this.answer = poly.toFactorForm() + " \\cdot \\left(" + polyIrreductible.toTeX() + "\\right)";
        }
    }

    getFormulation(): string {
        return "$" + this.question + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$ ";
    }

    getDistractors(): string[] {
        return [];
    }
}