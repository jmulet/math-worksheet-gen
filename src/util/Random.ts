import * as Ran from 'random-seed';
import { Numeric } from '../math/Numeric';
import { Vector } from '../math/Vector';
import { Polynomial } from '../math/Polynomial';
import { PolyMonomial } from '../math/PolyMonomial';
import { AlgebraicFraction } from '../math/AlgebraicFraction';
import { Monomial } from '../math/Monomial';
import { Literal } from '../math/Literal';

/**
 *
 *  Wrapper around RadomSeed
 *
 */
const VECTOR_NAMES = ['u', 'v', 'w', 'a', 'b', 'c'];
const BAR_NAMES = ['x', 'y', 'z', 't', 'a', 'b', 'c', 'n', 'm'];

 export class Random {
    private rnd: Ran.RandomSeed;
    
    constructor(seed?: string) {
        if(!seed) {
            seed = (new Date().getTime()).toString(36);            
        }
        this.rnd = Ran.create(seed);
    }

    intList(length: number, range: number): number[] {
        const array = [];
        for (let i=0; i < length; i++) {
            let random;
            if (i===0) {
                // First item cannot be zero
                random = this.intBetweenNotZero(-range, range);
            } else {
                random = this.rnd.intBetween(-range, range)
            }
            array.push(random);
        }   
        return array;
    }

    numericList(length: number, range: number, domain='Z'): Numeric[] {
        const array = [];
        for (let i=0; i < length; i++) {
            let random;
            if (i===0) {
                // First item cannot be zero
                random = this.numericBetweenNotZero(-range, range, domain);
            } else {
                random = this.numericBetween(-range, range, domain)
            }
            array.push(random);
        }   
        return array;
    }

    intBetween(min: number, max: number): number {
        return this.rnd.intBetween(min, max);        
    }

    numericBetween(min: number, max: number, domain='Z'): Numeric {
        let random = this.rnd.intBetween(min, max);
        if (domain==='Q') {
            let random2 = this.intBetween(1, max);
            return Numeric.fromFraction(random, random2);
        } else if (domain==='C') {
            let random2 = this.intBetween(1, max);
            return new Numeric(random, 1, random2, 1);
        }
        else {            
            return Numeric.fromNumber(random);
        }        
    }

    intBetweenNotZero(min: number, max: number): number {
        let random = this.intBetween(min, max);
        while (random === 0) {
            random = this.intBetween(min, max);           
        }
        return random;
    }

    numericBetweenNotZero(min: number, max: number, domain='Z'): Numeric {
        let random = this.numericBetween(min, max, domain);
        while (random.isZero()) {
            random = this.numericBetween(min, max, domain);        
        }
        return random;
    }

    fractionBetween(min: number, max: number): Numeric {
        let den = this.rnd.intBetween(1, max);
        let num = this.rnd.intBetween(0, max);
        while (num > den) {
            num = this.rnd.intBetween(1, max);
        }
        const numerator = min*den + (max-min)*num;        
        return Numeric.fromFraction(numerator, den);
    }

    fractionBetweenNotZero(min: number, max: number): Numeric {
        let random = this.fractionBetween(min, max);
        while (random.isZero()) {
            random = this.fractionBetween(min, max);          
        }
        return random;
    }

    complexBetween(min: number, max: number): Numeric {
        let re = this.rnd.intBetween(min, max);
        let im = this.rnd.intBetween(min, max);            
        return new Numeric(re, 1, im, 1);
    }


    pickOne(list: any[]): any {
        return list[this.rnd.intBetween(0, list.length-1)];
    }

    shuffle(list: any[]): any[] {
        const copy = list.slice();
        return copy.sort(() => this.rnd.random() - 0.5);
    }

    pickMany(list: any[], n: number): any[] {
        const shuffled = this.shuffle(list);
        if (n <= shuffled.length) {
            return shuffled.slice(0, n);
        } else {
            return shuffled;
        }
    }

    vector(dim=2, options?: any): Vector {        
        // Generates a random vector
        const opts = {symbol: 'v', domain: 'Z', range: 10, allowZero: false, ...options};
        const symbol = opts.symbol || this.pickOne(VECTOR_NAMES);
        let coefs;
        if (opts.domain === 'Z') {
           coefs = this.intList(dim, opts.range);
        } else {
            coefs = this.numericList(dim, opts.range, opts.domain);
        }
        let v = new Vector(coefs, symbol);        
        if (!opts.allowZero) {
            while (v.isZero()) {
                v = this.vector(dim, options);
            }
        }
        return v;
    }

    polynomial(options?: any): Polynomial {
        const opts = { minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', algIdentities: false, factorizable: false, ...options};
        const degree = this.intBetween(opts.minDegree, opts.maxDegree);
        
        if (opts.factorizable) {
            // Roots must be calculable. Build from roots; 
            let roots;
            if (opts.domain === 'Z') {
                // Assume fully factorizable degree n --> n roots
                roots = this.numericList(degree, opts.range, 'Z');                
            } else {
                 // Assume fully factorizable degree n --> n roots. At most two roots can be rational
                 roots = this.numericList(degree, opts.range, 'Z');
                 roots[0] = this.fractionBetween(-opts.range, opts.range);
                 if(this.intBetween(0, 1) === 1) {
                    roots[1] = this.fractionBetween(-opts.range, opts.range);
                 }
            }

            if (opts.domain === 'C') {
                // Allow complex roots; but real coefficients
                roots = this.shuffle(roots);
                const complex = this.complexBetween(-opts.range, opts.range);
                roots[0] = complex;
                roots[1] = complex.conjugate();
            }

            return Polynomial.fromRoots(roots);  
        } else {
            // No matter the roots, so coefficients are random
            const coefs = this.numericList(degree + 1, opts.range, opts.domain);
            return new Polynomial(coefs);
        }        
    }

    binomial(options?: any): PolyMonomial | Polynomial {
        const opts = { univariant: true, range: 10, maxDegree: 4, domain: 'Z', ...options};
        const coefs = this.numericList(2, opts.range, opts.domain);
        if (opts.univariant) {
            return new Polynomial(coefs);    
        } else {
            const letters = this.pickMany(BAR_NAMES, 2);
            const expo1 = this.intBetween(1, opts.maxDegree);
            const expo2 = this.intBetween(0, opts.maxDegree);
            const mono1 = new Monomial(coefs[0], [ new Literal(letters[0], expo1) ] );
            const mono2 = new Monomial(coefs[1], [ new Literal(letters[1], expo2) ] );
            return new PolyMonomial([mono1, mono2]);
        }        
    }
 
    algebraicFraction(options?: any): AlgebraicFraction {
        const opts = { range: 10, maxDegree: 4, domain: 'Z', ...options};
        const numerator = this.polynomial(opts);
        const denominator = this.polynomial(opts);
        return new AlgebraicFraction(numerator, denominator);
    }

}