import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../math/Polynomial";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random } from "../../util/Random";
import { Radical } from "../../math/Radical";
import { Power } from "../../math/Power";

export class RadicalsOpGen implements QuestionGenInterface {
    
    radicals: any[];
    answer: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand;
        const r = qGenOpts.question.interval || 10;
        const minIndex = qGenOpts.question.minIndex || 2;
        const maxIndex = qGenOpts.question.maxIndex || 12;

        this.radicals = [];

        for (let i=0; i < rnd.intBetween(2, 3); i++) {
            const index1 = rnd.intBetween(minIndex, maxIndex);
            const base = Random.pickOne(rnd, ["a", "b", "x", "y", rnd.intBetween(2, r)]);
            const power1 = new Power(base, Random.intBetween(rnd, 1, r));
            const radical1 = new Radical();
            this.radicals[i] = radical1;
        }
 
        if (this.radicals.length === 2) {
            const [r1, r2, ...r3] = this.radicals;
            this.answer = r1.multiply(r2);
        } else {
            const [r1, r2, r3, ...r4] = this.radicals;
            this.answer = r1.multiply(r2).divide(r3);
        }
    }

    getFormulation(): string {
        if (this.radicals.length === 2) {

        } else {
            
        }
        const bar = this.qGenOpts.question.bar || "x";
        return "$\\left(" +   "\\right)$";
    }

    getAnswer(): string {
        return "$" + this.answer.toString() + "$ ";
    }
}