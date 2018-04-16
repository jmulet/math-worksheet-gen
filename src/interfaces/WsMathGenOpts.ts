import  * as Random from 'random-seed';
import { WsSection } from '../worksheet/WsSection';

export interface Worksheet {
    sections: any[];
    includeKeys: boolean;
}

export interface WsMathGenOpts {
    seed?: number,
    rand?: Random.RandomSeed,
    worksheet?: Worksheet
}