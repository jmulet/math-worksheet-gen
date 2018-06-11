import { Numeric } from './Numeric';
import { RandomSeed } from 'random-seed';
import { Random } from '../util/Random';
import { Line } from './Line';
import { Vector } from './Vector';
import { PolyIdentities } from '../topics/algebra/polynomials/PolyIdentities';

export class Point {
    
    arrow: string;
    symbol: string;
    components: Numeric[];


    static midPoint(A: Point, B: Point): Point {
        return A.add(B).divide(2);
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
        this.arrow = symbol? symbol : "";
    }

    dimension(): number {
        return this.components.length;
    }

    oposite(): Point {
        const components2 = this.components.map( e =>  e.oposite() );
        return new Point(components2, "(-" + this.symbol+")");
    }

    copy(): Point {
        const components2 = this.components.map( e =>  e.copy() );
        return new Point(components2, this.symbol);
    }

    add(v: Point | Vector): Point {
        const n = this.dimension();
        if(n === v.dimension()) {
            const components2 = this.components.map( (e, i) => 
                e.add(v.components[i])
            );
            return new Point(components2, this.symbol + "+" + v.symbol);
        }
        else {
            throw "Invalid vector dimension"
        }
    }

    substract(v: Point): Point {
        return this.add(v.oposite());
    }

    divide(n: number | Numeric): Point {
        let nn;
        if (typeof(n) === "number") {
            nn = Numeric.fromNumber(n);
        } else { 
            nn = n;
        }
        const p = this.copy();
        p.components.forEach( c => c.divide(nn) );
        return p;
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

    protected firstComponentNonZero(): Numeric {
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

    distance(e: Point | Line): number {
        if (!e) {
            return null;
        }
        
        if (e instanceof Point) {
            return Vector.fromPoints(this, e).norm();
        } else {
            return e.distance(this);
        }
    } 
   
    toTeX(printSymbol?: boolean): string {
        let str = "";
        if (printSymbol) {
            str = "" + this.symbol;
        }
        return str + " \\left(" 
            + this.components.map( e => e.toTeX() ).join(", ")
            + "\\right) "
    }

    

}