 import { WsSection } from '../worksheet/WsSection';
import { Random } from '../util/Random';

export interface Worksheet {
    sections: any[];
    includeKeys: boolean;
    title?: string,
    instructions?: string,
    fullname?: string,
    showFirstQuestionAnswer: boolean
}

export interface WsMathGenOpts {
    seed?: number,
    rand?: Random,
    worksheet?: Worksheet,
    uniqueQuestionsMap: any
}