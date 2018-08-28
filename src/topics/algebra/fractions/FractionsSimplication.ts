import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { AlgebraicFraction } from '../../../math/AlgebraicFraction';
import { Polynomial } from '../../../math/Polynomial';
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
    category: "algebra/fractions/simplify",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "maxDegree",
            defaults: 3,
            description: "Maximum degree of the involved polynomials"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "1: Only one algebraic fraction with simple polynomials, 2: Only one fraction difficult polynomials, 3: Two fractions x or : with simple polynomials"
        }
    ]
})
export class FractionsSimplification implements QuestionGenInterface {
    answer: string;
    question: string;

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxDegree = qGenOpts.question.maxDegree || 3;
        const complexity = qGenOpts.question.complexity || 1;

        const generateFraction = function() {
            const factorX1 = rnd.intBetween(0, 3);
            const factorX2 = rnd.intBetween(0, 3);
            const root = rnd.intBetweenNotZero(-r, r);
            let polyNum: Polynomial, polyDen: Polynomial;
            // Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
            const [type1, type2] = rnd.pickMany([0, 1, 2], 2);
            polyNum = rootsFromIdentityType(factorX1, type1, root);
            polyDen = rootsFromIdentityType(factorX2, type2, root);
            return new AlgebraicFraction(polyNum, polyDen);
        }

       
        if (complexity === 1) {
            const frac = generateFraction();
            this.question = frac.toTeX();
            this.answer = Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        } else if (complexity === 2) {
            const frac = rnd.algebraicFraction({ range: r, maxDegree: maxDegree, simplificable: true });
            this.question = frac.toTeX();
            this.answer = Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        } else {
            const op = rnd.pickOne(["\\cdot", ":"]);
            const frac1: AlgebraicFraction = generateFraction();
            const frac2: AlgebraicFraction = generateFraction();
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX();
            
            let polyNum: Polynomial, polyDen: Polynomial;
            if (op === ":") {
                polyNum = (<Polynomial> frac1.polyNum).multiply(<Polynomial> frac2.polyDen);
                polyDen = (<Polynomial> frac1.polyDen).multiply(<Polynomial> frac2.polyNum);
            } else {
                polyNum = (<Polynomial> frac1.polyNum).multiply(<Polynomial> frac2.polyNum);
                polyDen = (<Polynomial> frac1.polyDen).multiply(<Polynomial> frac2.polyDen);
            }
            const frac = new AlgebraicFraction(polyNum, polyDen);
            this.answer = Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        }
 
    }

    async getFormulation(): Promise<string> {
        return "$" + this.question + " = {}$";
    }

    async getAnswer(): Promise<string> {
        return "$" + this.answer + "$ ";
    }
 
}