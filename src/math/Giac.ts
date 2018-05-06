import { Polynomial } from "./Polynomial";
import { Numeric } from "./Numeric";
import { platform } from "os";
import { AlgebraicFraction } from "./AlgebraicFraction";
import { PolyMonomial } from "./PolyMonomial";

const giac = require('bindings')('giac');

/**
 * Wrapper around giac
 */
export class Giac {
    
    static evaluate(str: string): string {
        return giac.evaluate(str);
    }

    static coeffs(polynomial: string, bar='x'): Numeric[] {
        console.log("Trying to parse polynomial", polynomial, bar);
        const str = Giac.evaluate('coeffs(' + polynomial + ', '+ bar + ')');
        const list = str.slice(str.indexOf('[')+1, str.length - 1).split(",");
        console.log("Trying to numeric parse ", list);
        return list.filter( (e) => e!=='undef').map( (e) => Numeric.parse(e) );
    }

    static parsePolynomial(str: string, bar='x'): Polynomial {        
        const coeffs = Giac.coeffs(str, bar);
        return new Polynomial(coeffs);
    }

    static parseAlgebraicFraction(str: string, bar='x'): AlgebraicFraction {
        const numer = giac.evaluate('numer(' + str + ')');
        const denom = giac.evaluate('denom(' + str + ')');
        return new AlgebraicFraction(Giac.parsePolynomial(numer), Giac.parsePolynomial(denom));
    }

    /**
     * Simplify some object and tries to cast it into the clazz type
     * if specified otherwise returns plain text
     */
    static simplify(expr: any, clazz?: {constructor: Function}): any {
        const simp = giac.evaluate('simplify(' + expr.toString() + ')');
        if (clazz === Polynomial) {
            return Giac.parsePolynomial(simp);
        } else if (clazz === AlgebraicFraction) {
            return Giac.parseAlgebraicFraction(simp);
        } else {
            return simp;
        }
    }   

    static factor(expr: any, latex?: boolean): string {
        let str = 'factor(' + expr.toString() + ')';
        if (latex) {
            str = 'latex(' + str + ')';
        }
        return giac.evaluate(latex);
    }
 
    static ifactors(expr: any): string {
        let str = 'ifactors(' + expr.toString() + ')';        
        return giac.evaluate(str);
    }


    static lcm( ...args: any[] ): string {
        return giac.evaluate('lcm(' + args.map(e => e.toString()).join(",") + ')');
    }
    static gcd( ...args: any[] ): string {
        return giac.evaluate('gcd(' + args.map(e => e.toString()).join(",") + ')');
    }

}