"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Vector_1 = require("./Vector");
const Line_1 = require("./Line");
class Triangle {
    constructor(A, B, C) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.AB = Vector_1.Vector.fromPoints(A, B);
        this.AC = Vector_1.Vector.fromPoints(A, C);
        this.CA = Vector_1.Vector.fromPoints(C, A);
        this.BA = Vector_1.Vector.fromPoints(B, A);
        this.BC = Vector_1.Vector.fromPoints(B, C);
        this.midAB = Point_1.Point.midPoint(this.A, this.B);
        this.midBC = Point_1.Point.midPoint(this.B, this.C);
        this.midCA = Point_1.Point.midPoint(this.C, this.A);
    }
    angles() {
        const a = this.AC.angle(this.AB);
        const b = this.BA.angle(this.BC);
        return [a, b, 180 - a - b];
    }
    vectors() {
        return [this.BC, this.CA, this.AB];
    }
    lengths() {
        return this.vectors().map(v => v.norm());
    }
    area() {
        const sides = this.lengths();
        const heights = this.heightValues();
        return sides[0] * heights[0] / 2;
    }
    lines() {
        return [new Line_1.Line(this.A, this.AB), new Line_1.Line(this.B, this.BC), new Line_1.Line(this.C, this.AC)];
    }
    bisectrices() {
        return null;
    }
    mediatrices() {
        const sides = this.lines();
        return [
            sides[0].perpendicularSecantLine(this.midAB),
            sides[1].perpendicularSecantLine(this.midBC),
            sides[2].perpendicularSecantLine(this.midCA),
        ];
    }
    medians() {
        return [
            new Line_1.Line(this.C, Vector_1.Vector.fromPoints(this.midAB, this.C)),
            new Line_1.Line(this.A, Vector_1.Vector.fromPoints(this.midBC, this.A)),
            new Line_1.Line(this.B, Vector_1.Vector.fromPoints(this.midCA, this.B))
        ];
    }
    heightLines() {
        const sides = this.lines();
        return [
            sides[0].perpendicularSecantLine(this.C),
            sides[1].perpendicularSecantLine(this.A),
            sides[2].perpendicularSecantLine(this.B),
        ];
    }
    heightValues() {
        const sides = this.lines();
        const heightLines = this.heightLines();
        const intersections = sides.map((s, i) => {
            return s.intersection(heightLines[i]);
        });
        return [
            this.C.distance(intersections[0]),
            this.A.distance(intersections[1]),
            this.B.distance(intersections[2])
        ];
    }
    ortocentre() {
        const heights = this.heightLines();
        return heights[0].intersection(heights[1]);
    }
    circumcentre() {
        const mediatrices = this.mediatrices();
        return mediatrices[0].intersection(mediatrices[1]);
    }
    incentre() {
        //todo bisectrices
        return null;
    }
    baricentre() {
        const medians = this.medians();
        return medians[0].intersection(medians[1]);
    }
}
exports.Triangle = Triangle;
//# sourceMappingURL=Triangle.js.map