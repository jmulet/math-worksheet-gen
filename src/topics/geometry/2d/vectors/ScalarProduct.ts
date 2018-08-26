import { WsGenerator } from '../../../../util/WsGenerator';
import { QuestionGenInterface } from '../../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../../interfaces/QuestionOptsInterface';
import { Vector } from '../../../../math/Vector';
import { Random } from '../../../../util/Random';
import { Formatter } from '../../../../util/Formatter';

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
    index: number;
    apartats: any[];
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const shuffle: boolean = qGenOpts.question.shuffle;
        const vecV = <Vector> qGenOpts.scope.vecV;
        const vecU = <Vector> qGenOpts.scope.vecU;
        const vecW = <Vector> qGenOpts.scope.vecW;      
        
        const num1 = rnd.numericBetweenNotZero(-r, r);
        const num2 = rnd.numericBetweenNotZero(-r, r);

        const combLineal = vecV.times(num1).add(vecW.times(num2));
        const op1 = vecU.dotProduct(combLineal);
        let term2 = Formatter.numericXstringTeX(true, num1, vecV.arrow, num2, vecW.arrow );
        
        const apartats = [
            {
                question: `$ ${vecU.arrow} \\cdot \\left( ${term2} \\right) $` ,
                answer: '$' + op1.toTeX() + '$'
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            }
        ];
                
        this.apartats = rnd.shuffle(apartats);
        this.index = -1;

    }

    getFormulation(): string {        
        this.index += 1;
        if (this.index > this.apartats.length - 1) {
            this.index = -1;
        }
        return this.apartats[this.index];
    }

    getAnswer(): string {        
        return '';
    }
 
    getDistractors(): string[] {
        return [];
    }
}