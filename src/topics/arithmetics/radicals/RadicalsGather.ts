import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { PolyRadical } from '../../../math/PolyRadical';
import { Radical } from '../../../math/Radical';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

@WsGenerator({
    category: "arithmetics/radicals/gather",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        }, 
        {
            name: "domain",
            defaults: "Z",
            description: "Type of coefficent number generated"
        }, 
        {
            name: "minElements",
            defaults: 2,
            description: "Max radical index"
        },
        {
            name: "maxSimplifiedRadicals",
            defaults: 2,
            description: "Maximum number of non equivalent radicals"
        },       
        {
            name: "maxElements",
            defaults: 5,
            description: "Max radical index"
        },              
        {
            name: "maxIndex",
            defaults: 5,
            description: "Max radical index"
        }        
    ]
})
export class RadicalsGather implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;        
        const minElements = qGenOpts.question.minElements || 3; 
        const maxElements = qGenOpts.question.maxElements || 5; 
        const maxSimplifiedRadicals = qGenOpts.question.maxSimplifiedRadicals || 2; 
        const domain = qGenOpts.question.domain || 'Z';
         
        this.radicals = [];

        const n = rnd.intBetween(minElements, maxElements);
        const index = rnd.intBetween(2, maxIndex);
        const nradInAnswer = rnd.intBetween(1, maxSimplifiedRadicals);

        const commonRads = rnd.intList(nradInAnswer, 2, 9);
        for (let i=0; i < n; i++) {            
            const j = rnd.intBetween(2, 5);
            const commonRad = rnd.pickOne(commonRads);          
            this.radicals[i] = new Radical(commonRad * Math.pow(j, index), index, rnd.numericBetweenNotZero(-r, r, domain));
        }
 
        const polyr = new PolyRadical(this.radicals);
        
        this.question = polyr.toTeX();  
        this.answer =  polyr.simplify().toTeX();                
    }

    async getFormulation(): Promise<string> {        
       return "$" + this.question + "$";
    }

    async getAnswer(): Promise<string> {
        return "$" + this.answer + "$";
    }

}