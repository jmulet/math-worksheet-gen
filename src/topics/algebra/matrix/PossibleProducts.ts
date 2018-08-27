import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Matrix } from '../../../math/Matrix';
import { QuizzStruct } from '../../../interfaces/QuizzStruct';

const matricesNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

@WsGenerator({
    category: "algebra/matrix/possibleProducts",
    parameters: [
        {
            name: "interval",
            defaults: 5,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "numMatrix",
            defaults: 3,
            description: "Number of matrices to be displayed 2--11"
        },
        {
            name: "minDim",
            defaults: 1,
            description: "minimum Dimension for matrices"
        },
        {
            name: "maxDim",
            defaults: 3,
            description: "maximum Dimension for matrices"
        },
        {
            name: "mustCompute",
            defaults: true,
            description: "Whether products must be computed or not"
        }       
    ]
})
export class PossibleProducts implements QuestionGenInterface {
    
    question: string;
    answer: string;
    steps: string = "";
    good: any[];
    bad: any[];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 5;
        let numMatrix =  qGenOpts.question.numMatrix || 3;
        if (numMatrix < 2) {
            numMatrix = 2;
        } else if(numMatrix > 11) {
            numMatrix = 11;
        }
        const minDim = qGenOpts.question.mimDim || 1;
        const maxDim = qGenOpts.question.maxDim || 3;
        const mustCompute = qGenOpts.question.mustCompute;
       
        const matrices = new Array<Matrix>(numMatrix);
        for (let i=0; i < numMatrix; i++) {
            let rows = rnd.intBetween(minDim, maxDim);
            let cols = rnd.intBetween(minDim, maxDim);
            if (rows + cols === 2) {
                if(rnd.intBetween(0,1)) {
                    while (cols + rows <= 2) {
                        cols = rnd.intBetween(minDim, maxDim);
                    }
                } else {
                    while (cols + rows <= 2) {
                        rows = rnd.intBetween(minDim, maxDim);
                    }
                }
            }
            
            matrices[i] = Matrix.fromDefinition(rows, cols, (i, j) => rnd.numericBetween(-r,r) );
            matrices[i].name = matricesNames[i];
        }

        this.question = matrices.map((m) => "$"+m.toTeX()+"$").join(",$\\,\\,$ ");

        this.answer = "";
        this.good = [];
        this.bad = [];
        for (let i=0; i < numMatrix; i++) {
            const first = matrices[i];
            for (let j=0; j < numMatrix; j++) {
                const second= matrices[j];
                const cas = first.name +" \\cdot " + second.name ;
                if (first.cols === second.rows ) {
                    this.answer += "$" + cas + "$";
                    this.good.push("\\(" + cas + "\\)");
                    if (mustCompute) {
                        this.answer += "= $" + first.multiply(second).toTeX() + "$";
                    }
                    this.answer += ",$\\quad$ ";
                } else {
                    this.bad.push("\\(" + cas + "\\)");
                }
            }
        }    
        if (!this.answer) {
            this.answer = "No hi ha cap producte possible."
        }
    }

    getFormulation(): string {
        return this.question;
    }

    getAnswer(): string {
        return this.answer;
    }

    getSteps(): string {
        return this.steps;
    }

    getQuizz(): QuizzStruct {        
        
        const correct =this.good.length === 0? this.bad : this.good;
        const incorrect =this.good.length === 0? this.good : this.bad;
        
        const correct2 = correct.map( e => {return  {html: e, grade: 100}});
        const incorrect2 = incorrect.map( e => {return  {html: e, grade: 0}});
        const merge = Random.shuffle([...correct2, ...incorrect2]).slice(0, 4);

        let numCorrect = merge.filter(e => e.grade===100).length;
        if (numCorrect === 0) {
            numCorrect = 1;
            merge[0] = correct2[0];
        }
        let numIncorrect = merge.length - numCorrect;

        merge.filter(e => e.grade===100).forEach(e => e.grade = 100./numCorrect);
        merge.filter(e => e.grade===0).forEach(e => e.grade = -100./numIncorrect);

        return {
            type: "multiplechoice",
            options: merge,
            html: this.good.length ===0 ? "<p><em>Tria els productes que no són possibles</em></p>" : "<p><em>Tria els productes possibles</em></p>"
        }
    }
}