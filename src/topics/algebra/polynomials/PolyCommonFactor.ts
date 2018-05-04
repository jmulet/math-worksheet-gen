import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';

@WsGenerator({
    category: "algebra/polynomial/commonfactor",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity; number of indeterminates. From 0-1"
        },
        {
            name: "fractions",
            defaults: false,
            description: "Allows fraction in coefficients"
        }
    ]
})
export class PolyCommonFactor implements QuestionGenInterface {

    answer: any;
    question: any;
    static Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;

        let [letter1, letter2, letter3] = rnd.pickMany(PolyCommonFactor.Symbols, 3);

        let coef1: Numeric, coef2: Numeric, coef3: Numeric, coef4: Numeric;
        coef1 = rnd.numericBetweenNotZero(-r, r);
        coef2 = rnd.numericBetweenNotZero(-r, r);
        coef3 = rnd.numericBetweenNotZero(-r, r);
        coef4 = rnd.numericBetweenNotZero(1, r);
        const expo1 = rnd.intBetween(1, r);
        const expo2 = rnd.intBetween(1, r);

        let mono1: Monomial, mono2: Monomial, mono3: Monomial, factor: Monomial;
        let poly: PolyMonomial, question: PolyMonomial;

        switch (complexity) {
            case 0:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1)]);
                question = PolyMonomial.multiply(factor, poly);
                break;
            default:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1), new Literal(letter2, expo2)]);                
                question = PolyMonomial.multiply(factor, poly);
                break;
        }

        this.question = question.toTeX();
        this.answer = factor.toTeX() + " \\cdot \\left(" + poly.toTeX() + "\\right)";
    }

    getFormulation(): string {
        return "$" + this.question + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$ ";
    }
}