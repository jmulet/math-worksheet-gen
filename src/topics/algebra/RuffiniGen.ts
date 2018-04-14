import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../math/Polynomial";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random } from "../../util/Random";

export class RuffiniGen implements QuestionGenInterface {
    
    answers: {quotient: Polynomial, reminder: Polynomial};
    polyD: Polynomial;
    polyd: Polynomial;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand;
        const r = qGenOpts.question.interval || 10;
        const minDegree = qGenOpts.question.minDegree || 2;
        const maxDegree = qGenOpts.question.maxDegree || 6;
        const coefs = Random.intList(rnd, rnd.intBetween(minDegree, maxDegree), r);
        this.polyD = new Polynomial(coefs);
        this.polyd = new Polynomial([1, Random.intBetweenNotZero(rnd, -r, r)]);
        this.answers = this.polyD.divide(this.polyd);
    }

    getFormulation(): string {
        const bar = this.qGenOpts.question.bar || "x";
        return "$\\left(" + this.polyD.toString(bar)  + "\\right) : \\left(" + this.polyd.toString(bar) + "\\right)$";
    }

    getAnswer(): string {
        const bar = this.qGenOpts.question.bar || "x";
        return "$Q(x)=" + this.answers.quotient.toString(bar)  + "$; $R=" + this.answers.reminder.toString(bar) + "$ ";
    }
}