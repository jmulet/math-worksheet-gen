import * as Ran from 'random-seed';
import { Numeric } from '../math/Numeric';
import { Vector } from '../math/Vector';
import { Polynomial } from '../math/Polynomial';
import { PolyMonomial } from '../math/PolyMonomial';
import { AlgebraicFraction } from '../math/AlgebraicFraction';
import { Monomial } from '../math/Monomial';
import { Literal } from '../math/Literal';
import { Radical } from '../math/Radical';
import { Giac } from '../math/Giac';

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

    monomial(options?: any): Monomial {
        const opts = { minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', maxVars: 1, ...options};
        const degree = this.intBetween(opts.minDegree, opts.maxDegree);

        const literals = [];
        if (opts.maxVars > 1) {
            const nvars = this.intBetween(1, opts.maxVars);
            const symbols = this.pickMany(BAR_NAMES, nvars);
            symbols.forEach( (symb) => {
                literals.push(new Literal(symb, this.intBetween(opts.minDegree, opts.maxDegree)));
            });            
        } else {
            literals.push(new Literal(this.pickOne(BAR_NAMES), this.intBetween(opts.minDegree, opts.maxDegree)));
        }
        return new Monomial(this.numericBetweenNotZero(-opts.range, opts.range, opts.domain), literals);
    }
    
    radical(options?: any): Radical {
        const opts = { minIndex: 2, maxIndex: 10, minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', maxVars: 1, algebraic: false, simplificable: false, ...options};
        
        const index = this.intBetween(opts.minIndex, opts.maxIndex);
        let divisorsOfIndex = Numeric.listDivisors(index);
        divisorsOfIndex.splice(divisorsOfIndex.length - 1, 1);
        
        let mono1, mono2;
        if (opts.algebraic) {
            mono1 = this.monomial(opts);
            (<Monomial> mono1).coef.Re["s"] = 1; // Make positive
            mono2 = this.monomial(opts);
            if (opts.simplificable) {
                const oneDivisor = this.pickOne(divisorsOfIndex);
                (<Monomial> mono1).coef.power(oneDivisor);
                (<Monomial> mono1).literals.forEach( (literal) => {
                    const times = this.intBetween(0, 3);                  
                    literal.exponent *= oneDivisor;
                    literal.exponent += times*index;
                });                
            }            
        } else {
            mono2 = this.numericBetweenNotZero(-opts.range, opts.range, opts.domain);
            if (opts.simplificable) {
                const oneDivisor = this.pickOne(divisorsOfIndex);
                const e1 = this.intBetween(0, 3);
                const e2 = this.intBetween(0, 2);
                const e3 = this.intBetween(0, 1);
                const number = Math.pow(2, e1*oneDivisor)* Math.pow(3, e2*oneDivisor)*Math.pow(5, e3*oneDivisor);                
                mono1 = Numeric.fromNumber(number);                
            } else {
                mono1 = this.numericBetween(2, opts.range, opts.domain);                
            }
        }
            
        return new Radical(mono1, index, mono2);
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
        let numerator, denominator;
        if (opts.simplificable) {
            const factor = this.polynomial({range: 4, maxDegree: this.intBetween(1, 2)});
            opts.maxDegree -= factor.degree();
            opts.range = 5;
            if(opts.maxDegree < 1) {
                opts.maxDegree = 1;
            }
            numerator = this.polynomial(opts).multiply(factor);
            denominator = this.polynomial(opts).multiply(factor);
        } else {
            numerator = this.polynomial(opts);
            denominator = this.polynomial(opts);
        }
        
        return new AlgebraicFraction(numerator, denominator);
    }

}