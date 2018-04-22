import { Numeric } from './Numeric';
import { RandomSeed } from 'random-seed';
import { Random } from '../util/Random';

export class Vector {
    
    arrow: string;
    symbol: string;
    components: Numeric[];

    static VECTOR_NAMES = ['u', 'v', 'w', 'a', 'b', 'c'];
    // Generates a random vector
    static random(rnd: RandomSeed, dim=2, symbol='v', range=10): Vector {
        symbol = symbol || Random.pickOne(rnd, Vector.VECTOR_NAMES);
        const coefs = Random.intList(rnd, dim, range);
        return new Vector(coefs, symbol);
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

    times(n: Numeric): Vector {
        const components2 = this.components.map( (c) => c.multiply(n));
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

    modulus2(): Numeric {
        return this.dotProduct(this);
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