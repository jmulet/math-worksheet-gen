import * as fs from 'fs';
import { WsMathGenerator, WsExportFormats } from '../src/worksheet/WsMathGenerator';
import { FractionsOperations } from '../src/topics/algebra/fractions/FractionsOperations';
import { PolyDivision } from '../src/topics/algebra/polynomials/PolyDivision';

const generator = new WsMathGenerator({
    seed: 0
});

const section = generator.addSection("Algebra");
let activity = section.createActivity("Divide these polynomials using Ruffini's rule.");
activity.useRepeat(PolyDivision, {}, 4);

activity = section.createActivity("Compute these operations with fractions.");
activity.useRepeat(FractionsOperations, {}, 2);

const html = generator.includeKeys(true).exportAs("test", WsExportFormats.HTML);
console.log(html);
fs.writeFileSync("index.html", html);