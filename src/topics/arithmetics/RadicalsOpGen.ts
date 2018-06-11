import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../math/Polynomial";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random, BAR_NAMES } from "../../util/Random";
import { Radical } from "../../math/Radical";
import { Power } from "../../math/Power";
import { WsGenerator } from "../../util/WsGenerator";

@WsGenerator({
    category: "arithmetics/radicals/operations",
    parameters: [
        {
            name: "interval",
            defaults: 4,
            description: "Range in which random coefficients are generated"
        }, 
        {
            name: "maxIndex",
            defaults: 5,
            description: "Max radical index"
        }, 
        {
            name: "algebraic",
            defaults: false,
            description: "Whether radicand and coefficent are algebraic or numeric"
        },
        {
            name: "operators",
            defaults: '*/',
            description: "Which operations must include"
        }
    ]
})
export class RadicalsOpGen implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const algebraic = qGenOpts.question.algebraic || false;
        const operators = qGenOpts.question.operators || '*/^r';
         
        this.radicals = [];

        const bar = rnd.pickOne(BAR_NAMES);
        const options = {range: r, maxIndex: maxIndex, algebraic: algebraic, useCoeff: false, maxVars: 1, bar: bar};
        const n = rnd.intBetween(1, 3);
        for (let i=0; i < n; i++) {           
            this.radicals[i] = rnd.radical(options);
        }
 
        if (this.radicals.length === 1) {
            const [r1, ...r2] = this.radicals;
            const rindex = rnd.intBetween(2, maxIndex);
            if (rnd.intBetween(0, 1) === 0) {               
                this.question = "$\\sqrt[" + rindex + "]{" + r1.toTeX() + " }$";
                this.answer = (<Radical> r1).enterCoefficient().root(rindex);
            } else {
                this.question = "$\\left( " + r1.toTeX() + " \\right)^{" + rindex + "}$"
                this.answer = (<Radical> r1).power(rindex);
            }
        }
        else if (this.radicals.length === 2) {
            const [r1, r2, ...r3] = this.radicals;
            if (rnd.intBetween(0, 1) === 1) {
                this.question = "$\\dfrac{" + r1.toTeX() + " }{ " + r2.toTeX() + "}$"
                this.answer = r1.divide(r2);
            } else {
                this.question = "$" + r1.toTeX() + " \\cdot " + r2.toTeX() + "$";
                this.answer = r1.multiply(r2);
            }
            
        } else {
            const [r1, r2, r3, ...r4] = this.radicals;
            this.answer = r1.multiply(r2).divide(r3);
            this.question = "$\\dfrac{" + this.radicals[0].toTeX() + " \\cdot " + this.radicals[1].toTeX() + "}{" + this.radicals[2].toTeX() + "}$";
        }
    }

    getFormulation(): string {        
       return this.question;
    }

    getAnswer(): string {
        return "$" + this.answer.simplify().toTeX() + "$";
    }

    getDistractors(): string[] {
        return [];
    }
}