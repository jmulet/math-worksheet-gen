import { QuestionGenInterface } from "../../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../../math/Polynomial";
import { QuestionOptsInterface } from "../../../interfaces/QuestionOptsInterface";
import { Random, BAR_NAMES } from "../../../util/Random";
import { Radical } from "../../../math/Radical";
import { Power } from "../../../math/Power";
import { WsGenerator } from "../../../util/WsGenerator";
import { Numeric } from "../../../math/Numeric";
import { PolyRadical } from "../../../math/PolyRadical";
import { Formatter } from "../../../util/Formatter";

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
        },
        {
            name: "useSingleBase",
            defaults: false,
            description: "Only one base appears in the operations"
        },
        {
            name: "forceDifferentIndex",
            defaults: false,
            description: "When true all generated roots will have different indexes"
        },
        {
            name: "miscellania",
            defaults: false,
            description: "When true; generates simple but diverse operations involving radicals, fractions, powers and algebraic identities. That's why is called miscellania"
        },
    ]
})
export class RadicalsOperations implements QuestionGenInterface {

    question: string;
    radicals: Radical[];
    answer: string;

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const algebraic = qGenOpts.question.algebraic || false;
        const operators = qGenOpts.question.operators || '*/^r';
        const miscellania = qGenOpts.question.miscellania || false;
        const useSingleBase = qGenOpts.question.useSingleBase || false;
        const forceDifferentIndex = qGenOpts.question.forceDifferentIndex || false;


        if (!miscellania) {

            this.radicals = [];

            const bar = rnd.pickOne(BAR_NAMES);
            const options = { range: r, maxIndex: maxIndex, algebraic: algebraic, useCoeff: false, maxVars: 1, bar: bar };
            let n = rnd.intBetween(1, 3);
            if (useSingleBase && n < 2) {
                n = 2;
            }
            for (let i = 0; i < n; i++) {
                this.radicals[i] = rnd.radical(options);
            }
            if (forceDifferentIndex) {
                const indexes: number[] = rnd.shuffle(new Array(n).fill(2).map( (v, i) => i+2));
                this.radicals.forEach( (e, i) => e.index = indexes[i] );
            }

            // A single radical to be simplified
            if (this.radicals.length === 1) {
                const [r1, ...r2] = this.radicals;
                const rindex = rnd.intBetween(2, maxIndex);
                if (rnd.intBetween(0, 1) === 0) {
                    this.question = "$\\sqrt[" + rindex + "]{" + r1.toTeX() + " }$";
                    this.answer = (<Radical>r1).enterCoefficient().root(rindex).simplify().toTeX();
                } else {
                    this.question = "$\\left( " + r1.toTeX() + " \\right)^{" + rindex + "}$"
                    this.answer = (<Radical>r1).power(rindex).simplify().toTeX();
                }
            }
            // Two radicals to be divided or multiplied
            else if (this.radicals.length === 2) {
                const [r1, r2]: Radical[] = this.radicals;
                if (useSingleBase) { 
                    if (r1.radicand.literals.length) {
                        r1.radicand.coef = Numeric.fromNumber(1);
                    }
                   
                    r2.radicand = r1.radicand.copy();
                }
                if (rnd.intBetween(0, 1) === 1) {
                    this.question = "$\\dfrac{" + r1.toTeX() + " }{ " + r2.toTeX() + "}$"
                    this.answer = r1.divide(r2).simplify().toTeX();
                } else {
                    this.question = "$" + r1.toTeX() + " \\cdot " + r2.toTeX() + "$";
                    this.answer = r1.multiply(r2).simplify().toTeX();
                }

            } else {
                const [r1, r2, r3] = this.radicals;
                if (useSingleBase) { 
                    if (r1.radicand.literals.length) {
                        r1.radicand.coef = Numeric.fromNumber(1);
                    }
                    r2.radicand = r1.radicand.copy();
                    r3.radicand = r1.radicand.copy();
                }
                this.answer = r1.multiply(r2).divide(r3).simplify().toTeX();
                this.question = "$\\dfrac{" + this.radicals[0].toTeX() + " \\cdot " + this.radicals[1].toTeX() + "}{" + this.radicals[2].toTeX() + "}$";
            }
        } else {
            // Miscellania stuff
            const coin = rnd.intBetween(0, 5);
            if (coin === 0) {
                const [a, d, b] = rnd.pickMany([2, 3, 5, 7, 8], 3);
                
                const c = rnd.intBetween(2, 5, );      
                const rad1 = new Radical(a, 2, Numeric.fromFraction(a, b));          
                let coef = Numeric.fromFraction(c, d);
                const op = rnd.pickOne(['+', '-']);
                if ( op === "-") {
                    coef = coef.oposite();
                }
                const rad2 = new Radical(d, 2, coef);
                const radicals = new PolyRadical([rad1, rad2]);
                
                this.question = "$\\dfrac{" + a + "}{\\sqrt{" + b + "}} " + op + " \\dfrac{"+ c + "}{\\sqrt{" + d + "}} $";
                this.answer = radicals.simplify().toTeX();
            } else if (coin === 1) {
                const [a, b] = rnd.pickMany([2, 3, 5, 7, 8], 2);
                const op = rnd.pickOne(['+', '-']);
                this.question = "$\\left( "  + a +  op + "\\sqrt{" + b + "} \\right)^2$";
                this.answer = (a*a + b) + op + (2*a) + "\\sqrt{" + b + "}";
            } else if (coin === 2) {
                const [a, b, c, d] = rnd.pickMany([2, 3, 5, 7, 8], 4); 
                this.question = "$\\left( "  + a + "\\sqrt{" + b + "}  + "  + c + "\\sqrt{" + d + "}  \\right) \\cdot" +
                                 "\\left( "  + a + "\\sqrt{" + b + "}  - "  + c + "\\sqrt{" + d + "}  \\right)$";              
                this.answer = (a*a*b  - c*c*d) + "";
            } else if (coin === 3) {
                const [a, b, c, d] = rnd.pickMany([2, 3, 5, 7, 8], 4);            
                const rad1 = new Radical(c, 2, Numeric.fromFraction(a*d, b*c));   
                this.question = "$\\dfrac{\\frac{" + a + "}{" + b + "}}{\\frac{\\sqrt{" + c + "}}{" + d + "}}$";
                this.answer = rad1.simplify().toTeX();
            } else if (coin === 4) {
                const base = rnd.pickOne([2, 3, 5, 7, 8]);       
                let a = rnd.intBetween(-r, r, (x) => x!==0 && x!==1);
                let b = rnd.intBetween(2, 5);
                let n = rnd.intBetween(2, 5);
                let c = rnd.intBetween(2, 5);
                let d = rnd.intBetween(1, 5);
                this.question = "$" + Formatter.displayPower(base, a) + " \\cdot " + Formatter.displayPower(base, b, true) + 
                    " \\cdot " + Formatter.displayRoot(n, Formatter.displayPower(c, d))  + "$";

                const result = Numeric.fromNumber(a).add(Numeric.fromFraction(1, b)).add(Numeric.fromFraction(d, n));

                this.answer = base + "^{" + result.toTeX() + "}";
            } else {
                const base = rnd.pickOne([2, 3, 5, 7]);
                let c = rnd.intBetween(2, 5);                
                this.question = "$\\dfrac{1 + \\frac{1}{\\sqrt{" + base + "}}}{ 1 - \\frac{\\sqrt{" + base + "}}{" + c + "}}$";
                const den = base*base*(c*c - base);
                const num1 = c*base*base*(1 + c);
                const num2 = base*c*(base + c);
                this.answer = Numeric.fromFraction(num1, den).toTeX();
                if (num2/den > 0) {
                    this.answer += " + ";
                }
                if (num2 !== 0) {
                    this.answer += Numeric.fromFraction(num2, den).toTeX() + "\\sqrt{" + base + "}";
                }
            }
            
        }
    }

    async getFormulation(): Promise<string> {
        return this.question;
    }

    async getAnswer(): Promise<string> {
        return "$" + this.answer + "$";
    }

}