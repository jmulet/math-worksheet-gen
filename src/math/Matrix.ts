import { Vector } from "./Vector";
import { Numeric } from "./Numeric";

export class Matrix {

    static Identity(n: number): Matrix {
        return Matrix.fromDefinition(n, n, (i,j) => i===j? Numeric.fromNumber(1) : Numeric.fromNumber(0) );
    }

    static Zero(n: number, m: number): Matrix {
        return Matrix.fromDefinition(n, m, (i,j) => Numeric.fromNumber(0));
    }

    static fromNumbers(nums: number[][]): Matrix {
         const elems = [];
         nums.forEach( (r: number[]) => {
            elems.push(r.map( n=> Numeric.fromNumber(n)));
         });
         return new Matrix(elems);
    }

    static fromVectors(vs: Vector[]): Matrix {
        const elems = [];
        vs.forEach( (v: Vector) => {
           elems.push(v.components.map( n => n.copy()));
        });
        return new Matrix(elems);
    }

    static fromDefinition(n: number, m: number, dfun: Function): Matrix {
        const elems = new Array<Numeric[]>(n);
        for (var i=0; i < n; i++) {
            elems[i] = new Array<Numeric>(m);
            for (var j=0; j < m; j++) {
                elems[i][j] = dfun(i,j);
            }
        }        
        return new Matrix(elems);
    }

    elems: Numeric[][];
    rows = 0;
    cols = 0;
 
    constructor(elems: Numeric[][] ) {       
        this.elems = elems;
        this.rows = this.elems.length;
        if (this.rows) {
           const rowsLength = this.elems.map(r => r.length);
           const minLen = Math.min(...rowsLength);
           const maxLen = Math.max(...rowsLength);
           if (minLen !== maxLen) {
               throw "Irregular matrix are not supported.";
           } else {
               this.cols = minLen;
           }
        }
    }

    transpose(): Matrix {
        var elems = new Array<Numeric[]>(this.cols);
        for (var i=0; i < this.cols; i++) {
            elems[i]= new Array<Numeric>(this.rows);
            for (var j=0; j < this.rows; j++) {
                elems[i][j] = this.elems[j][i].copy();
            }
        }
        return new Matrix(elems);
    }

    opposite(): Matrix {
        var elems = this.elems.map( r => r.map(e => e.oposite()));
        return new Matrix(elems);
    }

    copy(): Matrix {
        var elems = this.elems.map( r => r.map(e => e.copy()));
        return new Matrix(elems);
    }

    isSquared(): boolean {
        return this.cols === this.rows && this.cols > 0;
    }

    add(m: Matrix): Matrix {
        //Match dimensions
        if(m.rows !== this.rows || m.cols !== this.cols) {
            throw "Invalid matrix dimensions for +";
        }

        var elems = this.elems.map( (r, i) => r.map( (e, j) => e.add(m.elems[i][j])));
        return new Matrix(elems);
    }

    substract(m: Matrix): Matrix {
        //Match dimensions
        if(m.rows !== this.rows || m.cols !== this.cols) {
            throw "Invalid matrix dimensions for -";
        }

        var elems = this.elems.map( (r, i) => r.map( (e, j) => e.substract(m.elems[i][j])));
        return new Matrix(elems);
    }

    multiply(m: Matrix | Vector | number | Numeric): Matrix {
        let elems;
        if (m instanceof Matrix) {
            if (this.cols !== m.rows) {
                throw "Invalid matrix dimensions for *";
            }
            elems = new Array<Numeric[]>(this.rows); 
            for (let i=0; i < this.rows; i++) {
                elems[i] = new Array<Numeric>(m.cols);
                for (let j=0; j < m.cols; j++) {
                    let sum = Numeric.fromNumber(0);
                    for (let k=0; k < this.cols; k++) {
                        sum = sum.add(this.elems[i][k].multiply(m.elems[k][j]));
                    }
                    elems[i][j] = sum;
                }
            }
        } else if (m instanceof Vector) {
            if (m.components.length !== this.cols) {
                throw "Invalid matrix dimensions for *";
            }
            elems = new Array<Numeric[]>(this.rows);
            for (let i=0; i < this.rows; i++) {
                elems[i] = new Array<Numeric>(1);
                let sum = Numeric.fromNumber(0);
                for (let k=0; k < this.cols; k++) {
                    sum = sum.add(this.elems[i][k].multiply(m.components[k]));
                }
                elems[i][0] = sum;
            }
        } else {
            if (typeof(m) === "number") {
                m = Numeric.fromNumber(m);
            }
            elems = this.elems.map( (r, i) => r.map( (e, j) => e.multiply(<Numeric> m)));
        }
        return new Matrix(elems);
    }

    divide(n: Numeric): Matrix {
        if (n.isZero()) {
            throw "Divide by zero";
        }         
        var elems = this.elems.map( (r) => r.map( (e) => e.divide(n)));
        return new Matrix(elems);
    }
    

    power(n: number): Matrix {
        if (!this.isSquared()) {
            throw "Power is not valid for square matrices";
        }
        let mat = <Matrix> this;
        if (n < 0) {
            mat = this.inverse();
            n = -n;
        }
        let p = Matrix.Identity(this.rows);
        for (let i=0; i < n; i++) {
            p = p.multiply(mat);
        }
        return p;
    }

    // Determinant by expansion of first row
    private static det(arr: Numeric[][]): Numeric {      
        let detVal = Numeric.fromNumber(0);
        if (arr.length === 1) {
            return arr[0][0];
        } else if (arr.length === 2) {
            return arr[0][0].multiply(arr[1][1]).substract(arr[1][0].multiply(arr[0][1]));
        } else {            
            for (var j=0; j < arr.length; j++) {
                const f = Numeric.fromNumber(Math.pow(-1, j ));
                const menor = Matrix.det(Matrix.removeRowCol(arr, 0, j));
                detVal = detVal.add(arr[0][j].multiply(f).multiply(menor));
            }
        }
        return detVal;
    }

    private static removeRowCol(arr: Numeric[][], i: number, j: number): Numeric[][] {
        // Clone the array
        let arr2 = arr.map(r => r.slice()); 
        arr2.splice(i, 1); 
        arr2.forEach(r => r.splice(j, 1));
        // Do not clone numerics 
        return arr2;
    }

    menor(row: number, col: number): Numeric { 
        const men = Matrix.removeRowCol(this.elems, row, col); 
        return Matrix.det(men);
    }

    adjunt(row: number, col: number): Numeric {
        const f = Numeric.fromNumber(Math.pow(-1, row+col ));
        return this.menor(row, col).multiply(f);
    }

    adjunts(): Matrix {
        let elems = new Array<Numeric[]>(this.rows);
        for (var i=0; i< this.rows; i++) {
            elems[i] = new Array<Numeric>(this.cols);
            for (var j=0; j< this.cols; j++) {
                elems[i][j] = this.adjunt(i, j);
            }
        }
        return new Matrix(elems);
    }

    determinant(): Numeric {
        return Matrix.det(this.elems);
    }

    inverse(): Matrix {
        if (!this.isSquared()) {
            throw "Inverse is only valid for square matrices";
        }
        const det = this.determinant(); 
        if (!det || det.isZero()) {
            throw "Inverse is only possible for regular matrices";
        }
        return this.transpose().adjunts().divide(det); 
    }

    getDimensions(): number[] {        
        return [this.rows, this.cols];
    }

    toString(): string {
        const rows = this.elems.map(r => {
            return "[" + r.map(e => e.toString()).join(", ") + "]";
        });       
        return "[" +  rows.join(", ") + "]";
    }

    toTeX(): string {
        const rows = this.elems.map(r => {
            return r.map(e => e.toTeX()).join(" & ");
        });
        return "\\left( \\begin{array}{" + new Array(this.cols).fill("c").join(" ") + "}" + rows.join(" \\\\[2mm]") + "\\end{array} \\right)";
    }

}
    