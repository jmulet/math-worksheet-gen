"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Vector_1 = require("./Vector");
const BARS = ["x", "y", "z"];
const PRECISION = 1e-6;
class Line {
    constructor(P, vector) {
        this.point = P;
        this.vector = vector;
        if (this.vector.dimension() < 2) {
            throw new Error("Lines vector must have dimension 2 or greater.");
        }
    }
    static fromPoints(A, B) {
        return new Line(A, Vector_1.Vector.fromPoints(A, B));
    }
    hasPoint(P) {
        const PX = Vector_1.Vector.fromPoints(P, this.point);
        return PX.isParallelTo(this.vector);
    }
    hasVector(v) {
        return this.vector.isParallelTo(v);
    }
    isParallelTo(e) {
        if (e instanceof Vector_1.Vector) {
            return this.hasVector(e);
        }
        else {
            return this.vector.isParallelTo(e.vector);
        }
    }
    isPerpendicularTo(e) {
        if (e instanceof Vector_1.Vector) {
            return this.vector.isPerpendicularTo(e);
        }
        else {
            return this.vector.isPerpendicularTo(e.vector);
        }
    }
    isCoincidentTo(e) {
        return this.isParallelTo(e) && this.hasPoint(e.point);
    }
    isSecantTo(e) {
        if (this.dimension() === 2) {
            return !this.hasVector(e.vector);
        }
        else if (this.dimension() === 3) {
            return Math.abs(Vector_1.Vector.determinant(this.vector, e.vector, Vector_1.Vector.fromPoints(this.point, e.point))) < PRECISION;
        }
        else {
            throw new Error("Not implemented");
        }
    }
    distance(e) {
        if (!e) {
            return null;
        }
        if (e instanceof Point_1.Point) {
            const baseP = this.perpendicularBasepoint(e);
            const vec = Vector_1.Vector.fromPoints(baseP, e);
            return vec.norm();
        }
        else {
            if (this.isCoincidentTo(e) || this.isSecantTo(e)) {
                return 0;
            }
            else {
                return this.distance(e.point);
            }
        }
    }
    perpendicularBasepoint(P) {
        const PA = Vector_1.Vector.fromPoints(this.point, P);
        const lambda = PA.dotProduct(this.vector).toNumber() / this.vector.norm2().toNumber();
        return this.point.add(this.vector.times(lambda));
    }
    perpendicularSecantLine(P) {
        const baseP = this.perpendicularBasepoint(P);
        const vec = Vector_1.Vector.fromPoints(baseP, P);
        return new Line(P, vec);
    }
    parallelLine(P) {
        return new Line(P, this.vector);
    }
    angle(e) {
        return this.vector.angle(e.vector);
    }
    intersection(e) {
        if (!this.isSecantTo(e)) {
            return null;
        }
    }
    dimension() {
        return this.vector.dimension();
    }
    toTeX(form = Line.FORMS.VECTORIAL) {
        const dim = this.dimension();
        const X = "(" + this.point.components.map((e, i) => {
            if (dim <= 3) {
                return BARS[i];
            }
            else {
                return "x_" + i;
            }
        }).join(",") + ")";
        return X + "=" + this.point.toTeX() + " \\lambda " + this.vector.toTeX(false);
    }
}
Line.FORMS = {
    VECTORIAL: 0,
    PARAMETRIC: 1,
    CONTINUOUS: 2,
    GENERAL: 3,
    POINTSLOPE: 4,
    EXPLICIT: 5
};
exports.Line = Line;
//# sourceMappingURL=Line.js.map