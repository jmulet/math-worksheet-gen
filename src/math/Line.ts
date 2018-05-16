import { Point } from "./Point";
import { Vector } from "./Vector";
import { timingSafeEqual } from "crypto";

const BARS = ["x", "y", "z"];
const PRECISION = 1e-6;

export class Line {
    static FORMS = {
        VECTORIAL: 0,
        PARAMETRIC: 1,
        CONTINUOUS: 2,
        GENERAL: 3,
        POINTSLOPE: 4,
        EXPLICIT: 5
    };
    vector: Vector;
    point: Point;

    static fromPoints(A: Point, B: Point) {
        return new Line(A, Vector.fromPoints(A, B));
    }

    constructor(P: Point, vector: Vector) {
        this.point = P;
        this.vector = vector;
        if (this.vector.dimension() < 2) {
            throw new Error("Lines vector must have dimension 2 or greater.");
        }
    }

    hasPoint(P: Point): boolean {
        const PX = Vector.fromPoints(P, this.point);
        return PX.isParallelTo(this.vector);
    }

    hasVector(v: Vector): boolean {
        return this.vector.isParallelTo(v);
    }

    isParallelTo(e: Vector | Line): boolean {
        if (e instanceof Vector) {
            return this.hasVector(e);
        } else {
            return this.vector.isParallelTo(e.vector);
        }
    }

    isPerpendicularTo(e: Vector | Line) {
        if (e instanceof Vector) {
            return this.vector.isPerpendicularTo(e);
        } else {
            return this.vector.isPerpendicularTo(e.vector);
        }
    }

    isCoincidentTo(e: Line): boolean {
        return this.isParallelTo(e) && this.hasPoint(e.point);
    }

    isSecantTo(e: Line): boolean {
        if (this.dimension()===2) {
            return !this.hasVector(e.vector);
        } else if (this.dimension()===3) {
            return Math.abs(Vector.determinant(this.vector, e.vector, Vector.fromPoints(this.point, e.point)) ) < PRECISION;
        } else {
            throw new Error("Not implemented");
        }
    }

    distance(e: Point | Line): number {
        if (!e) {
            return null;
        }
        if (e instanceof Point) {
            const baseP = this.perpendicularBasepoint(e);
            const vec = Vector.fromPoints(baseP, e);
            return vec.norm();
        } else {
            if (this.isCoincidentTo(e) || this.isSecantTo(e)) {
                return 0;
            } else {
                return this.distance(e.point);
            }
        }
    }

    perpendicularBasepoint(P: Point): Point {
        const PA = Vector.fromPoints(this.point, P);
        const lambda = PA.dotProduct(this.vector).toNumber() / this.vector.norm2().toNumber();
        return this.point.add(this.vector.times(lambda));
    }

    perpendicularSecantLine(P: Point): Line {
        const baseP = this.perpendicularBasepoint(P);
        const vec = Vector.fromPoints(baseP, P);
        return new Line(P, vec);
    }

    parallelLine(P: Point): Line {
        return new Line(P, this.vector);
    }

    angle(e: Line): number {
        return this.vector.angle(e.vector);
    }

    intersection(e: Line): Point {
        if (!this.isSecantTo(e)) {
            return null;
        }  


    }

    dimension() {
        return this.vector.dimension();
    }

    toTeX(form= Line.FORMS.VECTORIAL): string {
        const dim = this.dimension();
        const X ="("+this.point.components.map((e,i) => {
           if(dim <= 3) {
               return BARS[i];
           } else {
                return "x_"+i;
           }
        }).join(",")+")";

        return X + "=" + this.point.toTeX() + " \\lambda " + this.vector.toTeX(false);
    }
}