export class WsDynImg {
    id: string;
    engine: "gnuplot" | "tikz" | "ggb";
    script: string;
    dimensions: number[];
    base64?: string;

    constructor(script: string, engine?: "gnuplot" | "tikz" | "ggb", dimensions?: number[]) {
        this.id = "#dynimg-"+Math.random().toString(32).substring(2);
        this.script = script;
        this.engine = engine;
        if (dimensions) {
            this.dimensions = dimensions;
        }
    }
}