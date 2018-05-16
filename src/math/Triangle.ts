import { Point } from "./Point";
import { Vector } from "./Vector";
import { Line } from "./Line";

export class Triangle {
    midCA: Point;
    midBC: Point;
    midAB: Point;
    protected BC: Vector;
    protected BA: Vector;
    protected AC: Vector;
    protected CA: Vector;
    protected AB: Vector;

    constructor(public A: Point, public B: Point, public C: Point){
        this.AB = Vector.fromPoints(A, B);
        this.AC = Vector.fromPoints(A, C);
        this.CA = Vector.fromPoints(C, A);
        this.BA = Vector.fromPoints(B, A);
        this.BC = Vector.fromPoints(B, C);

        this.midAB = Point.midPoint(this.A, this.B);
        this.midBC = Point.midPoint(this.B, this.C);
        this.midCA = Point.midPoint(this.C, this.A);
    }

    angles(): number[] {
        const a = this.AC.angle(this.AB);
        const b = this.BA.angle(this.BC);
        return [a, b, 180 - a - b];
    }

    vectors(): Vector[] {
        return [this.BC, this.CA, this.AB];
    }

    lengths(): number[] {
        return this.vectors().map( v => v.norm() );
    }

    
    area(): number {
        const sides = this.lengths();
        const heights = this.heightValues();
        return sides[0]*heights[0]/2;
    }

    lines(): Line[] {
        return [new Line(this.A, this.AB), new Line(this.B, this.BC), new Line(this.C, this.AC)];
    }

    bisectrices(): Line[] {
        return null;
    }

    mediatrices(): Line[] {
        const sides = this.lines();
        return [
            sides[0].perpendicularSecantLine(this.midAB),
            sides[1].perpendicularSecantLine(this.midBC),
            sides[2].perpendicularSecantLine(this.midCA),
        ]
    }

    medians(): Line[] {
        return [
            new Line(this.C, Vector.fromPoints(this.midAB, this.C)),
            new Line(this.A, Vector.fromPoints(this.midBC, this.A)),
            new Line(this.B, Vector.fromPoints(this.midCA, this.B))
        ]
    }

    heightLines(): Line[] {
        const sides = this.lines();
        return [
            sides[0].perpendicularSecantLine(this.C),
            sides[1].perpendicularSecantLine(this.A),
            sides[2].perpendicularSecantLine(this.B),
        ]
    }

    heightValues(): number[] {
        const sides = this.lines();
        const heightLines = this.heightLines();
        const intersections = sides.map( (s, i) => {
            return s.intersection(heightLines[i]);
        }); 

        return [
            this.C.distance(intersections[0]),
            this.A.distance(intersections[1]),
            this.B.distance(intersections[2])
        ];
    }

    ortocentre(): Point {
        const heights = this.heightLines();
        return heights[0].intersection(heights[1]);
    }

    circumcentre(): Point {
        const mediatrices = this.mediatrices();
        return mediatrices[0].intersection(mediatrices[1]);
    }

    incentre(): Point {
        //todo bisectrices
        return null;
    }

    baricentre(): Point {
        const medians = this.medians();
        return medians[0].intersection(medians[1]);
    }

}