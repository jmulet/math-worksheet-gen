import * as RS from 'random-seed';
import { Numeric } from '../math/Numeric';

export class Random {

    static intList(rnd: RS.RandomSeed, length: number, range: number): number[] {
        const array = [];
        for (let i=0; i < length; i++) {
            let random;
            if (i===0) {
                random = Random.intBetweenNotZero(rnd, -range, range);
            } else {
                random = rnd.intBetween(-range, range)
            }
            array.push(random);
        }   
        return array;
    }

    static intBetween(rnd: RS.RandomSeed, min: number, max: number): Numeric {
        let random = rnd.intBetween(min, max);
        return Numeric.fromNumber(random);
    }

    static intBetweenNotZero(rnd: RS.RandomSeed, min: number, max: number): Numeric {
        let random = rnd.intBetween(min, max);
        while (random === 0) {
            random = rnd.intBetween(min, max);           
        }
        return Numeric.fromNumber(random);
    }

    static fractionBetween(rnd: RS.RandomSeed, min: number, max: number): Numeric {
        let den = rnd.intBetween(1, max);
        let num = rnd.intBetween(0, max);
        while (num > den) {
            num = rnd.intBetween(1, max);
        }
        const numerator = min*den + (max-min)*num;        
        return Numeric.fromFraction(numerator, den);
    }

    static fractionBetweenNotZero(rnd: RS.RandomSeed, min: number, max: number): Numeric {
        let random = Random.fractionBetween(rnd, min, max);
        while (random.isZero()) {
            random = Random.fractionBetween(rnd, min, max);          
        }
        return random;
    }

    static pickOne(rnd: RS.RandomSeed, list: any[]): any {
        return list[rnd.intBetween(0, list.length-1)];
    }
}