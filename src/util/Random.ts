import * as Ran from 'random-seed';

import { AlgebraicFraction } from '../math/AlgebraicFraction';
import { Circumference, Conics, Elipse, Hiperbola, Parabola } from '../math/Conics';
import {
    ElementalFunction,
    ExponentialFunction,
    HyperboleFuntion,
    LinealFunction,
    LogarithmFunction,
    QuadraticFunction,
    RadicalFunction,
    TrigonometricFunction,
} from '../math/ElementalFunction';
import { Line } from '../math/Line';
import { Literal } from '../math/Literal';
import { Monomial } from '../math/Monomial';
import { Numeric } from '../math/Numeric';
import { Point } from '../math/Point';
import { PolyMonomial } from '../math/PolyMonomial';
import { Polynomial } from '../math/Polynomial';
import { Radical } from '../math/Radical';
import { Vector } from '../math/Vector';

/**
 *
 *  Wrapper around RadomSeed
 *
 */
export const VECTOR_NAMES = ['u', 'v', 'w', 'a', 'b', 'c'];
export const BAR_NAMES = ['x', 'y', 'z', 't', 'a', 'b', 'c', 'n', 'm'];

 export class Random {
    seed: string;
    private rnd: Ran.RandomSeed;

    static shuffle(a: any[]): any[] {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    
    static fillRange(start, end): number[] {
        return Array(end - start + 1).fill(0).map((item, index) => start + index);
      };
    
    constructor(seed?: string) {
        this.seed = seed;
        if(!seed) {
            this.seed = (new Date().getTime()).toString(36);            
        }
        this.seed = this.seed.toLowerCase();
        this.rnd = Ran.create(this.seed);
    }

    decimal(a: number, b: number, decimals: number = 2) {
        if(decimals < 0) {
            decimals = 2;
        }
        const pow = Math.pow(10, decimals);
        return Math.round(this.rnd.floatBetween(a, b)*pow)/pow;
    }

    intList(length: number, range: number, rangeMax?: number): number[] {
        const array = [];
        if (!rangeMax) {
            rangeMax = range;
            range = -range;
        }
        for (let i=0; i < length; i++) {
            let random;
            if (i===0) {
                // First item cannot be zero
                random = this.intBetweenNotZero(range, rangeMax);
            } else {
                random = this.rnd.intBetween(range, rangeMax)
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

    intBetween(min: number, max: number, condition?: Function): number {
        let val = this.rnd.intBetween(min, max);        
        if (condition) {
            while (!condition(val)) {
                val = this.rnd.intBetween(min, max);        
            }

        } 
        return val;        
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
 
    monomial(options?: any): Monomial {
        const opts = { minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', maxVars: 1, bar: '', ...options};
        const degree = this.intBetween(opts.minDegree, opts.maxDegree);

        const literals = [];
        if (opts.maxVars > 1) {
            const nvars = this.intBetween(1, opts.maxVars);
            const symbols = this.pickMany(BAR_NAMES, nvars);
            symbols.forEach( (symb) => {
                literals.push(new Literal(symb, this.intBetween(opts.minDegree, opts.maxDegree)));
            });            
        } else {
            const bar = opts.bar || this.pickOne(BAR_NAMES);
            literals.push(new Literal(bar, this.intBetween(opts.minDegree, opts.maxDegree)));
        }
        return new Monomial(this.numericBetweenNotZero(-opts.range, opts.range, opts.domain), literals);
    }
    
    radical(options?: any): Radical {
        const opts = { minIndex: 2, maxIndex: 10, minDegree: 1, maxDegree: 5, range: 10,
                       domain: 'Z', maxVars: 1, bar: '', algebraic: false, 
                       useCoeff: true,
                       ...options};
        
        const index = this.intBetween(opts.minIndex, opts.maxIndex);
      
        let divisorsOfIndex = Numeric.listDivisors(index);
        divisorsOfIndex.splice(0, 1);
        
        let mono1, mono2;
        if (opts.algebraic) {
            mono1 = this.monomial(opts);
            (<Monomial> mono1).coef.Re["s"] = 1; // Make positive
            if (opts.useCoeff) {
                mono2 = this.monomial(opts);
            } else {
                mono2 = Monomial.fromNumber(1);
            }
            if (opts.simplificable) {
                const oneDivisor = this.pickOne(divisorsOfIndex);
                (<Monomial> mono1).coef.power(oneDivisor);
                (<Monomial> mono1).literals.forEach( (literal) => {
                    const times = this.intBetween(1, 3);                  
                    literal.exponent *= oneDivisor;
                    literal.exponent += times*index;
                });                
            }            
        } else {
            if(opts.useCoeff) {
                mono2 = this.numericBetweenNotZero(-opts.range, opts.range, opts.domain);
            } else {
                mono2 = Numeric.fromNumber(1);    
            }

            if (opts.simplificable) {
                let oneDivisor = this.pickOne(divisorsOfIndex);
                if (oneDivisor === 1) {
                    oneDivisor = index;
                }
                const e1 = this.intBetween(0, 3);
                const e2 = this.intBetween(0, 2);
                const e3 = this.intBetween(0, 1);
                const r1 = this.intBetween(0, 2);
                const r2 = this.intBetween(0, 2);
                const r3 = this.intBetween(0, 2);
                const number = Math.pow(2, e1*oneDivisor+r1)* Math.pow(3, e2*oneDivisor+r2)*Math.pow(5, e3*oneDivisor+r3);                
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

    point(dim=2, options?: any): Point {
        const opts = { range: 10, domain: 'Z', ...options};
        const components = this.numericList(dim, opts.range, opts.domain);
        return new Point(components);
    }

    vector(dim?: number, options?: any): Vector {        
        dim = dim || 2; 
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

    line(dim=2, options?: any): Line {
        options.allowZero = false;
        return new Line(this.point(dim, options), this.vector(dim, options));
    }

    circumference(options?: any): Circumference {
        return new Circumference(this.point(), this.intBetween(1, options.range | 10)); 
    }

    elipse(options?: any): Elipse {
        return new Elipse(this.point(), this.intBetween(1, options.range | 10), this.intBetween(1, options.range | 10)); 
    }

    hiperbola(options?: any): Hiperbola {
        return new Hiperbola(this.point(), this.intBetween(1, options.range | 10), this.intBetween(1, options.range | 10)); 
    }

    parabola(options?: any): Parabola {
        return new Parabola(this.point(), this.numericBetween(1, 5), this.intBetween(0, 1)); 
    }

    conic(options?: any): Conics {        
        switch(this.intBetween(0, 3)) {
            case 0:
                return this.circumference(options);                
            case 1:
                return this.elipse(options);
            case 2:
                return this.hiperbola(options);
            case 3:
                return this.parabola(options);
        }
    }


    elementalFunction(mylist?: number | number[], options?: any) {
            const opts = {range: 10, domain: 'Z', ...options};
            let list;
            if (Array.isArray(mylist)) {
                list = [...mylist];
            } else if (typeof (mylist) === "number") {
                list = [mylist];
            }
            else {
                list = Object.keys(ElementalFunction.types).map((key)=> ElementalFunction.types[key]);
            };
            var type = this.pickOne(list);

            switch (type) {
                case ElementalFunction.types.Lineal: 
                    const m = this.numericBetween(-opts.range, opts.range, opts.domain);
                    const n = this.numericBetween(-opts.range, opts.range, opts.domain);
                    return new LinealFunction(m, n);
                    
                case ElementalFunction.types.Quadratic: 
                    let a = this.numericBetweenNotZero(-1, 1); 
                    if(opts.complexity > 0) {
                        a = this.numericBetweenNotZero(-2, 2);
                    } 
                    let b;
                    if(opts.complexity === 0) {
                        b = this.numericBetween(-5, 5, 'Z').multiply(Numeric.fromNumber(2));
                    } else {
                        b = this.numericBetween(-opts.range, opts.range, opts.domain);
                    }
                    const c = this.numericBetween(-opts.range, opts.range, opts.domain);
                    return new QuadraticFunction(a, b, c);

                case ElementalFunction.types.Radical: 
                    const a2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                    const b2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                    return new RadicalFunction(a2, b2);

                case ElementalFunction.types.Hyperbole:
                    const m2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                    const n2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                    const p = this.numericBetween(-opts.range, opts.range, opts.domain);
                    return new HyperboleFuntion(m2, n2, p);

                case ElementalFunction.types.Exponential: 
                    const base = this.numericBetween(2, opts.range);
                    return new ExponentialFunction(base);

                case ElementalFunction.types.Logarithm: 
                    const base2 = this.numericBetween(2, opts.range);
                    return new LogarithmFunction(base2);

                default: 
                    const type = this.pickOne(['sin', 'cos', 'tan']);
                    const amp = this.numericBetweenNotZero(-opts.range, opts.range, opts.domain);
                    const w = this.numericBetween(1, 4);
                    return new TrigonometricFunction(type, amp, w);
            }
    }


 

    /**
     * Generates a random funcion with complexity n
     * from bloc funtions in funcs list and operations in ops
     * which can be + - * / and comp
     */
    rfunction(n, ops: string[], funcs) {
        var op = this.pickOne(ops);
        var f1 = funcs.random();
        var f2 = funcs.random();

        var str = "";
        if (op === '+') {
            str = f1.toString('x') + " " + op + " " + f2.toString('x');
        }
        else if (op === '-') {
            str = f1.toString('x') + " " + op + " (" + f2.toString('x') + ")";
        }
        else if (op === '*' || op === '/') {
            str = "(" + f1.toString('x') + ") " + op + " (" + f2.toString('x') + ")";
        }
        else if (op === 'comp') {
            str = f1.toString(f2.toString('x'));
        }
        return str;
    }
 
    
 
 
 
}

