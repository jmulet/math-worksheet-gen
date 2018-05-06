import { Radical } from "./Radical";
import { Formatter } from "../util/Formatter";
import { PolyMonomial } from "./PolyMonomial";

// + or - of Radical objects
export class PolyRadical {
    constructor(public radicals: Radical[]) {        
    }

    simplify(): PolyRadical{
        // Simplify every radical in list and join those equivalents (equal)
        const radicals2 = this.radicals.map( (r) => r.simplify() );
        const cache: any = {};
        radicals2.forEach( (r)=> {
            const key = r.toTeX({coef: false});
            let objList = cache[key];
            if (!objList) {
                objList = {
                    radicand: r.radicand,
                    index: r.index,
                    coefs: []
                };
                cache[key] = objList;
            }
            objList.coefs.push(r.coefficient);
        });

        // Build new polyRadical from cache object by merging objList's
        const radicals3 = [];
        for (var key in cache) {
            const obj = cache[key];
            const mergedCoeff = new PolyMonomial(obj.coefs);
            if (mergedCoeff.monomials.length===1) {
                radicals3.push(new Radical(obj.radicand, obj.index, mergedCoeff.monomials[0]));
            } else {
                throw "PolyRadical:: simplify not implemented with polynomonial coeffs";
            }            
        }
        return new PolyRadical(radicals3);
    }

    toTeX(): string {
        const args = [];
        this.radicals.forEach( (r) => {
            args.push(r.coefficient);
            args.push(r.toTeX({coef: false}));
        });

        return Formatter.numericXstringTeX(false, ...args);
    }

    toString(): string {
        const args = [];
        this.radicals.forEach( (r) => {
            args.push(r.coefficient);
            args.push(r.toString({coef: false}));
        });

        return Formatter.numericXstring(...args);
    }
}