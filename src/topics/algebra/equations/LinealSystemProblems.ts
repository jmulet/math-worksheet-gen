import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

const VARNAMES = ["x", "y", "z", "t", "w"];

/*
@WsGenerator({
    category: "algebra/system/linealproblems",
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
            description: "From 2 to 3"
        }  
    ]
})
export class EquationsLinealSystem implements QuestionGenInterface {
 
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let dimension = qGenOpts.question.dimension || 2; 
        
        const database = [];

        // El problema que d'aquesta forma multiples cridadades resultara en duplicitat de problemes.
        if (dimension < 3) {
            // Problemes 3x3

        } else {
            // Problemes 2x2
        }
 
        this.question = "\\left\\{ \\begin{array}{ll}  ";
        this.question += eqnsTeX.join("\\\\");
        this.question += "\\end{array} \\right.";
    }

    getFormulation(): string {
        return "$" + this.question + "$";
    }

    getAnswer(): string {
        return "$ \\left(" + this.answer + " \\right)$" ;
    }

    getDistractors(): string[] {
        return [];
    }
}
*/