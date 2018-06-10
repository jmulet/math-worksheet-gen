import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random, BAR_NAMES } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Giac } from '../../../math/Giac';
import { Formatter } from '../../../util/Formatter';
import { Numeric } from '../../../math/Numeric';

const VARNAMES = ["x", "y", "z", "t", "w"];

@WsGenerator({
    category: "algebra/equations/linealsystem",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity; From 1-2"
        },
        {
            name: "dimension",
            defaults: 2,
            description: "number of variables of the system from 2 to 5"
        },
        {
            name: "nequations",
            defaults: 2,
            description: "number of equations of the system from 2 to 5"
        }  
    ]
})
export class EquationsLinealSystem implements QuestionGenInterface {
 
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        const dimension = qGenOpts.question.dimension || 2; 
        const nequations = qGenOpts.question.nequations || dimension; 

        const eqns = [];
        const eqnsTeX = [];
        const bars = BAR_NAMES.slice(0, dimension);
        
        for (var i=0; i < nequations; i++) {
            const coefs = rnd.intList(dimension, -r, r);
            const lhsTeX = coefs.map( (e, k) => Formatter.numericXstringTeX(false, Numeric.fromNumber(e), BAR_NAMES[k]));
            const lhs = coefs.map( (e, k) => Formatter.numericXstring(Numeric.fromNumber(e), BAR_NAMES[k]));
            const rhs = rnd.intBetween(-r,r);
            eqns.push(lhs + "=" + rhs);
            eqnsTeX.push(lhsTeX + "&=" + rhs);
        }

        this.question = "\\left\\{ \\begin{array}{ll}  ";
        this.question += eqnsTeX.join("\\\\");
        this.question += "\\end{array} \\right.";
        this.answer =  Giac.evaluate("latex(linsolve(["+ eqns.join(",") +"], [" + bars + "]))").replace(/"/g, "");
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