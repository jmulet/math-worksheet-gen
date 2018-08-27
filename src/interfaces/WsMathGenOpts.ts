import { Random } from '../util/Random';

export interface Worksheet {
    sections: any[];
    includeKeys: number;    // 0=none, 1=one key, 2=all keys, -1: one step, -2: all steps
    title?: string,
    instructions?: string,
    fullname?: string,
    sectionless: boolean
}

export interface WsMathGenOpts {
    seed?: number,
    rand?: Random,
    worksheet?: Worksheet,
    uniqueQuestionsMap?: any
}