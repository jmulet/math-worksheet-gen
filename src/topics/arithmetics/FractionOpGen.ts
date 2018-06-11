import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../math/Polynomial";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random } from "../../util/Random";
import { Radical } from "../../math/Radical";
import { Power } from "../../math/Power";
import { Numeric } from "../../math/Numeric";

export class FractionOpGen implements QuestionGenInterface {
    
    fractions: Numeric[];
    answer: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const min = qGenOpts.question.min || -10;
        const max = qGenOpts.question.max || 10;

        this.fractions = [];

        for (let i=0; i < 5; i++) {
            this.fractions[i] = rnd.fractionBetweenNotZero(min, max);
        }
        
        const [f1, f2, f3, f4, f5] = this.fractions;

        this.answer = (f1.add(f2)).divide( <Numeric> (f3.substract(f4)).multiply(f5) );
    }

    getFormulation(): string {        
        const [f1, f2, f3, f4, f5] = this.fractions;
        return "$\\frac{" + f1.toTeX() + " + " + f2.toTeX()  + "}{\\left(" + f3.toTeX() + "-" + f4.toTeX() + "\\right)\\cdot " + f5.toTeX() + " }$";
    }

    getAnswer(): string {
        return "$" + this.answer.toTeX() + "$";
    }

    getDistractors(): string[] {
        return [];
    }
}