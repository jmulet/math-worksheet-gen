import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Equation } from '../../../math/Equation';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Matrix } from '../../../math/Matrix';
import { Numeric } from '../../../math/Numeric';
import { QuizzStruct } from '../../../interfaces/QuizzStruct';

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
    steps: string = "";
    inverse: Matrix;
    m: Matrix;

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 5;
        const dim = qGenOpts.question.dim || 2;
       
        this.m = Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r,r) );
         
        this.question = this.m.toTeX();

        try {
            this.inverse = this.m.inverse();
            const transpose = this.m.transpose();
            const adjunts = transpose.adjunts();
            this.answer = "$" + this.inverse.toTeX() + "$";
            const det = this.m.determinant();
            this.steps = "$|M|=" + det.toTeX() + "$ $\\rightarrow$ ";
            if(det.isZero()) {
                this.steps += " $\\nexists \\,  M^{-1}$ ";
            } else {
                this.steps += " $M^t = " + transpose.toTeX() + "$ $\\,\\rightarrow\\,$  adj$(M^t)=" + adjunts.toTeX() + 
                "$ $\\,\\rightarrow\\,$ $M^{-1} = \\dfrac{1}{" + det.toTeX() + "} " + adjunts.toTeX() + "$ = " + this.answer;
            }
        } catch(Ex) { 
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

    getQuizz(): QuizzStruct {
        const mat = this.inverse? this.inverse : Matrix.fromDefinition(this.m.rows, this.m.cols, ()=>null);
        return {
            type: "cloze",
            html: `
                <p>\\(M^{-1}=\\) ${mat.toClozeForm()}</p>
                <p><em>Deixa els quadres buits si la inversa no existeix.</em></p>
            `
        }
    }
}