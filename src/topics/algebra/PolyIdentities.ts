import { QuestionGenInterface } from '../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../interfaces/QuestionOptsInterface';
import { Polynomial } from '../../math/Polynomial';
import { Random } from '../../util/Random';
import { WsGenerator } from '../../util/WsGenerator';
import { Monomial } from '../../math/Monomial';

@WsGenerator({
    category: "Algebra/PolyIdentities",
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
    static Symbols = ["x", "y", "z", "a", "b", "c"];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand;
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;

        let letter1 = Random.pickOne(rnd, PolyIdentities.Symbols);
        let letter2 = Random.pickOne(rnd, PolyIdentities.Symbols);

        let mono1: Monomial, mono2: Monomial;
        let identityType = rnd.intBetween(0, 2); //0 = + square, 1 = - square, 2 = + x -
        switch (complexity) {
            case 0: 
                const coef1 = 1;
                const coef2 = rnd.intBetween(1, r);
                mono1 = new Monomial(coef1, letter1);
                mono2 = new Monomial(coef2, []);
                break;
            case 1:
                mono1 = "";
                mono2 = "";
                break;
            case 2:
                mono1 = "";
                mono2 = "";
                break;
            case 3:
                mono1 = "";
                mono2 = "";
                break;
        }

        let expanded, factorized;
        switch(identityType) {
            case 0:
                factorized = "";
                expanded = "";
            case 1:
                factorized = "";
                expanded = "";
            case 2:
                factorized = "";
                expanded = "";
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
        return "$" + this.question.toString() + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer.toString() + "$ ";
    }
}