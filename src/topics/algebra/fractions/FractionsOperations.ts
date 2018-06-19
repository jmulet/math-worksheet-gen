import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';
import { PolyCommonFactor } from '../polynomials/PolyCommonFactor';
import { Polynomial } from '../../../math/Polynomial';
import { AlgebraicFraction } from '../../../math/AlgebraicFraction';
import { Giac } from '../../../math/Giac';

// Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
function rootsFromIdentityType(factorX1, type1, root): Polynomial {
    const roots = [];
    for (let i = 0; i < factorX1; i++) {
        roots.push(0);
    }
    if (type1 === 0) {
        roots.push(root);
        roots.push(root);
    } else if (type1 === 1) {
        roots.push(-root);
        roots.push(-root);

    } else {
        roots.push(root);
        roots.push(-root);

    }
    return Polynomial.fromRoots(roots);
}

@WsGenerator({
    category: "algebra/fractions/operations",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity; number of indeterminates. From 0-1"
        },
        {
            name: "fractions",
            defaults: false,
            description: "Allows fraction in coefficients"
        }
    ]
})
export class FractionsOperations implements QuestionGenInterface {

    answer: any;
    question: any;
    static Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;

        let [letter1, letter2, letter3] = rnd.pickMany(PolyCommonFactor.Symbols, 3);

        let coef1: Numeric, coef2: Numeric, coef3: Numeric, coef4: Numeric;
        coef1 = rnd.numericBetweenNotZero(-r, r);
        coef2 = rnd.numericBetweenNotZero(-r, r);
        coef3 = rnd.numericBetweenNotZero(-r, r);
        coef4 = rnd.numericBetweenNotZero(1, r);
        const expo1 = rnd.intBetween(1, r);
        const expo2 = rnd.intBetween(1, r);

        const generateFraction = function(useRoot: number) {
            const factorX2 = rnd.intBetween(0, 3);
            let polyNum: Polynomial, polyDen: Polynomial;

            // Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
            const type2 = rnd.intBetween(0, 2);
            const numCoefs = rnd.numericList(2, r, 'Z');
            polyNum = new Polynomial(numCoefs);
            polyDen = rootsFromIdentityType(factorX2, type2, useRoot);
            return new AlgebraicFraction(polyNum, polyDen);
        }
 
        /** 
        switch (complexity) {
            case 0:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1)]);
                question = PolyMonomial.multiply(factor, poly);
                break;
            default:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1), new Literal(letter2, expo2)]);                
                question = PolyMonomial.multiply(factor, poly);
                break;
        }
        */


        const root = rnd.intBetweenNotZero(-r, r);
        if (complexity <= 1) {           
            const frac1: AlgebraicFraction = generateFraction(root);
            const frac2: AlgebraicFraction = generateFraction(root);
            const op: string = rnd.pickOne(['+', '-']);
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX(); 
            const computation =  frac1.toString() + " " + op + " " + frac2.toString();
            this.answer = Giac.evaluate("latex(collect(simplify(" + computation + ")))").replace(/"/g,"").replace(/\\frac/g,"\\dfrac");
        } else {
            const frac1: AlgebraicFraction = generateFraction(root);
            const frac2: AlgebraicFraction = generateFraction(root);
            const frac3: AlgebraicFraction = generateFraction(root);
            const op: string = rnd.pickOne(['+', '-']);
            const op2: string = rnd.pickOne(['*', '/']);
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX(); 
            let computation =  frac1.toString() + " " + op + " " + frac2.toString();
            if (op2 === "*") {
                computation =  "(" + computation + ") * " + frac3.toString(); 
                this.question = "\\left(" + this.question + "\\right) \\cdot " + frac3.toTeX(); 
            } else {
                computation =  "(" + computation + ") / (" + frac3.toString() + ")"; 
                this.question = "\\left(" + this.question + "\\right) : " + frac3.toTeX(); 
            }
          
            this.answer = Giac.evaluate("latex(collect(simplify(" + computation + ")))").replace(/"/g,"").replace(/\\frac/g,"\\dfrac");
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