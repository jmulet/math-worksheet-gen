import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyMonomial } from '../../../math/PolyMonomial';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Monomial } from '../../../math/Monomial';
import { Literal } from '../../../math/Literal';
import { Numeric } from '../../../math/Numeric';
import { PolyCommonFactor } from '../polynomials/PolyCommonFactor';

@WsGenerator({
    category: "algebra/fractions/simplify",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "maxDegree",
            defaults: 3,
            description: "Maximum degree of the involved polynomials"
        } 
    ]
})
export class FractionsSimplification implements QuestionGenInterface {
    answer: any;
    question: any; 

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxDegree = qGenOpts.question.maxDegree || 3;
 
        const question = rnd.algebraicFraction({ range: r, maxDegree: maxDegree, simplificable: true });

        this.question = question.toTeX();
        this.answer = question.simplified().toTeX();
    }

    getFormulation(): string {
        return "$" + this.question + " = {}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$ ";
    }
}