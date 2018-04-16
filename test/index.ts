import { MathWsGen, WsExportFormats, WsTopics } from "../src/worksheet/MathWsGen"; 
import * as fs from 'fs';

const generator = new MathWsGen({
    seed: 0
});

const section = generator.addSection("Algebra");
let activity = section.createActivity("Divide these polynomials using Ruffini's rule.");
activity.use(WsTopics.Algebra.Ruffini, {}).repeat(4);

activity = section.createActivity("Compute these operations with fractions.");
activity.use(WsTopics.Arithmetics.FractionOp, {}).repeat(2);

const html = generator.includeKeys(true).exportAs(WsExportFormats.HTML);
console.log(html);
fs.writeFileSync("index.html", html);