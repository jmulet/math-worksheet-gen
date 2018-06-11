"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const WsMathGenerator_1 = require("../src/worksheet/WsMathGenerator");
const FractionsOperations_1 = require("../src/topics/algebra/fractions/FractionsOperations");
const PolyDivision_1 = require("../src/topics/algebra/polynomials/PolyDivision");
const generator = new WsMathGenerator_1.WsMathGenerator({
    seed: 0
});
const section = generator.addSection("Algebra");
let activity = section.createActivity("Divide these polynomials using Ruffini's rule.");
activity.useRepeat(PolyDivision_1.PolyDivision, {}, 4);
activity = section.createActivity("Compute these operations with fractions.");
activity.useRepeat(FractionsOperations_1.FractionsOperations, {}, 2);
const html = generator.includeKeys(true).exportAs(WsMathGenerator_1.WsExportFormats.HTML);
console.log(html);
fs.writeFileSync("index.html", html);
//# sourceMappingURL=index.js.map