import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';

@WsGenerator({
    category: "algebra/polynomial/identities",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        }, 
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity in the terms * of the binomial (* - *)^2. From 0-3"
        },
        {
            name: "fractions",
            defaults: false,
            description: "Allows fraction in coefficients"
        },
        {
            name: "indirect",
            defaults: false,
            description: "Given the polynomial, it must be expressed as an identity"
        }
    ]
})
export class PolyIdentities implements QuestionGenInterface {
    
    answer: any;
    question: any;
    static Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;

        let [ letter1, letter2 ] = rnd.pickMany(PolyIdentities.Symbols, 2);
        
        let mono1: Monomial, mono2: Monomial;
        let identityType = rnd.intBetween(0, 2); //0 = + square, 1 = - square, 2 = + x -
        let coef1, coef2, exp1, exp2;
        switch (complexity) {
            case 0: 
                coef1 = 1;
                coef2 = rnd.intBetween(1, r);
                mono1 = new Monomial(coef1, letter1);
                mono2 = new Monomial(coef2, []);
                break;
            case 1:
                coef1 = 1;
                coef2 = rnd.intBetween(1, r);
                mono1 = new Monomial(coef1, letter1);
                mono2 = new Monomial(coef2, letter2);
                break;
            case 2:
                coef1 = rnd.intBetween(1, r);
                coef2 = rnd.intBetween(1, r);
                exp1 =  rnd.intBetween(2, r);
                exp2 =  rnd.intBetween(2, r);
                mono1 = new Monomial(coef1, [new Literal(letter1, exp2)]);
                mono2 = new Monomial(coef2, [new Literal(letter2, exp1)]);
            default:
                coef1 = rnd.fractionBetweenNotZero(1, r);
                coef2 = rnd.intBetween(1, r);
                exp1 =  rnd.intBetween(2, r);
                exp2 =  rnd.intBetween(2, r);
                mono1 = new Monomial(coef1, [new Literal(letter1, exp2)]);
                mono2 = new Monomial(coef2, [new Literal(letter2, exp2)]);
        }

        let expanded, factorized;
        switch(identityType) {
            case 0:
                factorized = "\\left(" + mono1.toTeX() + " + " + mono2.toTeX() + "\\right)^2";
                expanded = PolyMonomial.power(PolyMonomial.add(mono1, mono2), 2).toTeX();
                break;
            case 1:
                factorized = "\\left(" + mono1.toTeX() + " - " + mono2.toTeX() + "\\right)^2";
                expanded = PolyMonomial.power(PolyMonomial.substract(mono1, mono2), 2).toTeX();
                break;
            case 2:
                factorized = "\\left(" + mono1.toTeX() + " + " + mono2.toTeX() + "\\right) \\cdot \\left(" + mono1.toTeX() + " - " + mono2.toTeX() + "\\right)";
                expanded = PolyMonomial.multiply(PolyMonomial.add(mono1, mono2), PolyMonomial.substract(mono1, mono2)).toTeX();
                break;
        }

        if(qGenOpts.question.indirect) {
            this.question = expanded;
            this.answer = factorized;
        } else {
            this.question = factorized;
            this.answer = expanded;
        }
             
    }

    getFormulation(): string {
        return "$" + this.question + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$ ";
    }

    getDistractors(): string[] {
        return [];
    }
}