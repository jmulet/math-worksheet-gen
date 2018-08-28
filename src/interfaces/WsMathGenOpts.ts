import { Random } from '../util/Random';
import { WsExportTypes } from '../worksheet/wsExporter';

export interface QuestionWs {
    repeat: number,
    gen: string,
    options: { [s: string]: any },
    expanded: boolean,
    parent?: ActivityWs
}

export interface ActivityWs {
    formulation: string,
    scope?: { [s: string]: any } ,
    questions: QuestionWs[],
    parent?: SectionWs
}

export interface SectionWs {
    name: string,
    activities: ActivityWs[]
}

export interface Worksheet {
    lang: string,
    sid: string,
    seed: string,
    type: WsExportTypes,
    levels: string,
    baseURL?: string,
    visibility: number;     //0 | 1 | 2 //none, shared, public
    includeKeys: number,    // 0=none, 1=one key, 2=all keys, -1: one step, -2: all steps
    keysPlacement?: 0,
    sections: SectionWs[],
    sectionless: boolean
    title?: string,
    instructions?: string,
    fullname?: string,
    author?: string
}

export interface WsMathGenOpts {
    seed?: number,
    rand?: Random,
    worksheet?: Worksheet,
    uniqueQuestionsMap?: any
}