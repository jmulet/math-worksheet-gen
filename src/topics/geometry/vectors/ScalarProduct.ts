import { WsGenerator } from '../../../util/WsGenerator';
import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Vector } from '../../../math/Vector';

@WsGenerator({
    category: "geometry/vectors/scalar_product",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "vecU",
            defaults: null,
            description: "Vector object u"
        },
        {
            name: "vecV",
            defaults: null,
            description: "Vector object v"
        },
        {
            name: "vecW",
            defaults: null,
            description: "Vector object w"
        }
    ]
})
export class ScalarProduct implements QuestionGenInterface {
   
    vecU: Vector;
    vecV: Vector;
    vecW: Vector;
    
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand;
        const r = qGenOpts.question.interval || 10;
        this.vecV = qGenOpts.question.vecV;
        this.vecU = qGenOpts.question.vecU;
        this.vecW = qGenOpts.question.vecW;        
    }

    getFormulation(): string {
        const bar = this.qGenOpts.question.bar || "x";
        let str = "Given the vectors $"+ this.vecU.toTeX(true) 
                  +"$ and $" + this.vecV.toTeX(true) + "$";
        return str;
    }

    getAnswer(): string {
        
        return "$$";
    }
}