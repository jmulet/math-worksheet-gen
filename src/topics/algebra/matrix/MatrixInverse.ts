import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Equation } from '../../../math/Equation';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Matrix } from '../../../math/Matrix';
import { Numeric } from '../../../math/Numeric';

@WsGenerator({
    category: "algebra/matrix/inverse",
    parameters: [
        {
            name: "interval",
            defaults: 5,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "dim",
            defaults: 2,
            description: "Dimension of matrices 2--4"
        }       
    ]
})
export class MatrixInverse implements QuestionGenInterface {
    
    question: string;
    answer: string;
    steps: string;

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 5;
        const dim = qGenOpts.question.dim || 2;
       
        const m = Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r,r) );
         
        this.question = m.toTeX();

        try {
            const inverse = m.inverse();
            const transpose = m.transpose();
            const adjunts = transpose.adjunts();
            this.answer = "$" + inverse.toTeX() + "$";
            const det = m.determinant();
            this.steps = "$|M|=" + det.toTeX() + "$ $\\rightarrow$ ";
            if(det.isZero()) {
                this.steps += " $\\nexists \\,  M^{-1}$ ";
            } else {
                this.steps += " $M^t = " + transpose.toTeX() + "$ $\\,\\rightarrow\\,$  adj$(M^t)=" + adjunts.toTeX() + 
                "$ $\\,\\rightarrow\\,$ $M^{-1} = \\dfrac{1}{" + det.toTeX() + "} " + adjunts.toTeX() + "$ = " + this.answer;
            }
        } catch(Ex) {
            console.log(Ex)
            this.answer = "$\\nexists \\, M^{-1}$";
        }
    }

    getFormulation(): string {
        return "$M = " + this.question + "$";
    }

    getAnswer(): string {
        return this.answer;
    }

    getSteps(): string {
        return this.steps;
    }

    getDistractors(): string[] {
        return [];
    }
}