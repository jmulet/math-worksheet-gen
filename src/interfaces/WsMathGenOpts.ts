 import { WsSection } from '../worksheet/WsSection';
import { Random } from '../util/Random';

export interface Worksheet {
    sections: any[];
    includeKeys: boolean;
}

export interface WsMathGenOpts {
    seed?: number,
    rand?: Random,
    worksheet?: Worksheet
}