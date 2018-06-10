import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';
import { PolyCommonFactor } from '../polynomials/PolyCommonFactor';
import { Equation } from '../../../math/Equation';
import { Interval } from '../../../math/Interval';

@WsGenerator({
    category: "algebra/equations/polynomial",
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
            name: "minDegree",
            defaults: 1,
            description: "minDegree of polynomial"
        },
        {
            name: "maxDegree",
            defaults: 2,
            description: "maxDegree of polynomial"
        },
        {
            name: "specialType",
            defaults: "",
            description: "Use: biquadratic"
        }
    ]
})
export class EquationsPolynomial implements QuestionGenInterface {

   
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;
        const minDegree = qGenOpts.question.minDegree || 1;
        const maxDegree = qGenOpts.question.maxDegree || 2;
        const specialType = qGenOpts.question.specialType;

        const degree = rnd.intBetween(minDegree, maxDegree);
        const eqn = new Equation(rnd);
       
        if (specialType === "biquadratic") {
            const roots = rnd.numericList(2, -r, r).map(e => {
                if(rnd.intBetween(0,1) === 0) {
                   return e.multiply(e);
                } else {
                   return e.multiply(e).oposite();
                }
            });
            eqn.biquadraticFromQuadraticRoots(roots, complexity);
        } else {
            const roots = rnd.intList(degree, -r, r);
            eqn.polynomialFromRoots(roots, degree, complexity);
        }
 
        this.question = eqn.toTeX();
        this.answer = eqn.solutionsTeX();
    }

    getFormulation(): string {
        return "$" + this.question + "$";
    }

    getAnswer(): string {
        return this.answer;
    }

    getDistractors(): string[] {
        return [];
    }
}