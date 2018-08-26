import { Numeric } from './Numeric';
import { RandomSeed } from 'random-seed';
import { Random } from '../util/Random';
import { Point } from './Point';
import * as mathjs from 'mathjs';

function trimArray(arr: Numeric[], len: number): Numeric[] {
    const clen = arr.length;
    const out = new Array(len);
    for (var i=0; i < len; i++) {
        if (i < clen) {
            out[i] = arr[i];
        } else {
            out[i] = Numeric.fromNumber(0);
        }
    }
    return out;
}

export class Vector {
    
    arrow: string;
    symbol: string;
    components: Numeric[];

    static fromPoints(A: Point, B: Point): Vector {
        if(!A || !B) {
            return null;
        }
        if (A.dimension() !== B.dimension()) {
            throw new Error("invalid point dimensions in fixed AB vector");
        }
        const components = [];
        A.components.forEach( (c, i) => components.push(B.components[i].substract(c)));
        return new Vector(components);
    }

    static determinant(...vectors: Vector[]): number {
        const dims = vectors.map(v => v.dimension());
        if(Math.min(...dims) !== Math.max(...dims)) {
            throw new Error("invalid dimensions in determinant");
        }
        const dim = Math.min(...dims);
        if (vectors.length !== dim) {
            throw new Error("invalid dimensions in determinant");
        }

        const matrix = vectors.map( v => {
            return v.components.map(c => c.toNumber());
         } );

        return mathjs.det(matrix);
    }

    constructor(components: (number | Numeric)[], symbol?: string) {        
        this.components = components.map((e)=> {
            if (typeof(e) === 'number') {
                return Numeric.fromNumber(e);
            } else {
                return e;
            }
        });

        this.symbol = symbol;
        this.arrow = symbol? `\\vec{${symbol}}` : "";
    }

    dimension(): number {
        return this.components.length;
    }

    times(n: Numeric | number): Vector {
        let nn: Numeric;
        if(typeof(n) === "number") {
            nn = Numeric.fromNumber(n);
        } else {
            nn = n;
        }
        const components2 = this.components.map( (c) => c.multiply(nn));
        return new Vector(components2);
    }

    dotProduct(v: Vector): Numeric {
        const n = this.dimension();
        if(n === v.dimension()) {
            const products = this.components.map( (e, i) => 
                e.multiply(v.components[i])
            );
            let scalar = products[0];
            for (let i=1; i < n ; i++) {
                scalar = scalar.add(products[i]);
            }
            return scalar;
        }
        else {
            throw "Invalid vector dimension"
        }
    }


    crossProduct(v: Vector): Vector {
        const n = this.dimension();
        if (v.dimension() <= 3 && n <= 3) {
            const a: Numeric[] = trimArray(this.components, 3);
            const b: Numeric[] = trimArray(v.components, 3);
            const c1 = a[1].multiply(b[2]).substract(b[1].multiply(a[2]));
            const c2 = a[2].multiply(b[0]).substract(b[2].multiply(a[0]));
            const c3 = a[0].multiply(b[1]).substract(b[0].multiply(a[1]));
            return new Vector([c1, c2, c3]);
        }
        else {
            throw "Invalid vector dimension"
        }
    }


    norm2(): Numeric {
        return this.dotProduct(this);
    }

    norm(): number {
        return Math.sqrt(this.dotProduct(this).toNumber());
    }

    angle(v: Vector): number {
        const op = this.dotProduct(v).toNumber() / (this.norm()*v.norm());
        return 180*Math.acos(op) / Math.PI;
    }

    oposite(): Vector {
        const components2 = this.components.map( e =>  e.oposite() );
        return new Vector(components2, "(-" + this.symbol+")");
    }

    copy(): Vector {
        const components2 = this.components.map( e =>  e.copy() );
        return new Vector(components2, this.symbol);
    }

    add(v: Vector): Vector {
        const n = this.dimension();
        if(n === v.dimension()) {
            const components2 = this.components.map( (e, i) => 
                e.add(v.components[i])
            );
            return new Vector(components2, this.symbol + "+" + v.symbol);
        }
        else {
            throw "Invalid vector dimension"
        }
    }

    substract(v: Vector): Vector {
        return this.add(v.oposite());
    }

    isZero(): boolean {
        const n = this.dimension();
        for (var i=0; i < n; i++) {
            if (!this.components[i].isZero()) {
                return false;
            }
        }
        return true;
    }

    private firstComponentNonZero(): Numeric {
        let comp = this.components[0];
        const n = this.dimension();
        let i = 1 ;
        while(comp.isZero() && i < n) {
            comp = this.components[i];
            i += 1;
        }
        if (comp.isZero()) {
            return null;
        }
        return comp;
    }

    isParallelTo(v: Vector, accuracy=1e-10): boolean {
        const n = this.dimension();
        if(n === v.dimension()) {
            if (this.isZero()) {
                return false;
            }  
            const first = this.firstComponentNonZero(); 
            const pos = this.components.indexOf(first);
            const ratio = v.components[pos].divide(first).abs();
        }
        else {
            throw "Invalid vector dimension"
        }        
    }

    isPerpendicularTo(v: Vector, accuracy = 1e-8): boolean {
        return this.dotProduct(v).abs() <= accuracy;
    }

    toTeX(printSymbol?: boolean): string {
        let str = "";
        if (printSymbol) {
            str = "\\vec " + this.symbol;
        }
        return str + " \\left(" 
            + this.components.map( e => e.toTeX() ).join(", ")
            + "\\right) "
    }

    

}