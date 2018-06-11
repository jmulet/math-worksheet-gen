import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Polynomial } from '../../../math/Polynomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

@WsGenerator({
    category: "algebra/polynomial/division",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "minDegree",
            defaults: 3,
            description: "Lowest degree of the generated polynomial"
        },
        {
            name: "maxDegree",
            defaults: 6,
            description: "Highest degree of the generated polynomial"
        },
        {
            name: "ruffini",
            defaults: false,
            description: "When set to true only divisions by (x+-a) are generated"
        },
        {
            name: "fractions",
            defaults: false,
            description: "Allows fraction coefficients in the quotient and reminder"
        }
    ]
})
export class PolyDivision implements QuestionGenInterface {
    
    answers: {quotient: Polynomial, remainder: Polynomial};
    polyD: Polynomial;
    polyd: Polynomial;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const minDegree = qGenOpts.question.minDegree || 3;
        const maxDegree = qGenOpts.question.maxDegree || 6;
        const coefs = rnd.intList(rnd.intBetween(minDegree, maxDegree), r);
        while (coefs[0] === 0) {
            coefs[0] = rnd.intBetween(-r, r);
        }
       
        if (qGenOpts.question.ruffini) {
            this.polyD = new Polynomial(coefs);
            this.polyd = new Polynomial([1, rnd.intBetweenNotZero(-r, r)]);
            this.answers = this.polyD.divide(this.polyd);
        } else {
            if(!qGenOpts.question.fractions) {
                // Reverse question, generate q, d and R, so D = q*d + R
                const DDegree = rnd.intBetween(minDegree, maxDegree - 1);
                const dDegree = rnd.intBetween(minDegree, DDegree - 2);
                const rDegree = rnd.intBetween(0, dDegree - 2);
                const qDegree = DDegree - dDegree;     
                
                this.polyd = new Polynomial(rnd.intList(dDegree + 1, r)); 
                this.answers = {
                    quotient: new Polynomial(rnd.intList(qDegree + 1, r)),
                    remainder: new Polynomial(rnd.intList(rDegree + 1, r))
                };
                this.polyD = this.polyd.multiply(this.answers.quotient).add(this.answers.remainder);
            } else {
                this.polyD = new Polynomial(coefs);
                const coefs2 = rnd.intList(rnd.intBetween(minDegree, this.polyD.degree()), r);
                this.polyd = new Polynomial(coefs2);
                this.answers = this.polyD.divide(this.polyd);
            } 
        }        
    }

    getFormulation(): string {
        const bar = this.qGenOpts.question.bar || "x";
        return "$\\left(" + this.polyD.toTeX(bar)  + "\\right) : \\left(" + this.polyd.toTeX(bar) + "\\right)$";
    }

    getAnswer(): string {
        const bar = this.qGenOpts.question.bar || "x";
        return "$Q(x)=" + this.answers.quotient.toTeX(bar)  + "$; $R=" + this.answers.remainder.toTeX(bar) + "$ ";
    }

    getDistractors(): string[] {
        return [];
    }
}