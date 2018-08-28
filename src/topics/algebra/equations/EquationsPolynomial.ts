import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Equation } from '../../../math/Equation';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

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
            description: "Complexity; number of indeterminates. From 0-2"
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
            description: "Use: biquadratic, factorizable"
        }
    ]
})
export class EquationsPolynomial implements QuestionGenInterface {

   
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
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
        }        
        else {
            const roots = rnd.numericList(degree, -r, r);
            if (specialType === "factorizable") {
                complexity = 0;
            }
            eqn.polynomialFromRoots(roots, degree, complexity);
        }
 
        this.question = eqn.toTeX();
        this.answer = eqn.solutionsTeX();
    }

    async getFormulation(): Promise<string> {
        return "$" + this.question + "$";
    }

    async getAnswer(): Promise<string> {
        return this.answer;
    }

}