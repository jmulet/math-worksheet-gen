import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';
import { Polynomial } from '../../../math/Polynomial';

@WsGenerator({
    category: "algebra/polynomial/factorize",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity. From 0-1"
        } 
    ]
})
export class PolyFactorize implements QuestionGenInterface {

    answer: any;
    question: any; 
    
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand;
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;
    
        const numRoots = rnd.intBetween(2, 5);
        const roots = Random.intList(rnd, numRoots, r).map( (e) => Numeric.fromNumber(e) );
        
        const poly = Polynomial.fromRoots(roots);
        this.question = poly.toString();
        this.answer = poly.toFactorForm();
    }

    getFormulation(): string {
        return "$" + this.question + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$ ";
    }
}