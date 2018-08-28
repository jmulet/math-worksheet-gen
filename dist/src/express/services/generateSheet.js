"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const latexToPdf_1 = require("../../util/latexToPdf");
const latexToOOO_1 = require("../../util/latexToOOO");
const wsExporter_1 = require("../../worksheet/wsExporter");
const WsMathGenerator_1 = require("../../worksheet/WsMathGenerator");
/**
 * A workbook is the definition of rules which will generate many Sheets
 */
const LATEX_FORMATS = ["tex", "latex", "pdf", "odt", "docx"];
function generateSheet(workbook, adt) {
    return __awaiter(this, void 0, void 0, function* () {
        const type = workbook.type;
        const exporterOpts = { includeKeys: workbook.includeKeys,
            keysPlacement: workbook.keysPlacement, sectionless: workbook.sectionless };
        let sheet = {};
        if (!adt) {
            // Create abstract document tree
            const gen = new WsMathGenerator_1.WsMathGenerator({ seed: workbook.seed });
            adt = yield gen.create(workbook);
            //Add it to the generated types in order to be stored in database
            sheet["json"] = wsExporter_1.wsExporter(adt, "json", exporterOpts);
        }
        if (LATEX_FORMATS.indexOf(type) >= 0) {
            sheet["latex"] = wsExporter_1.wsExporter(adt, "latex", exporterOpts);
            if (type === "pdf") {
                try {
                    sheet[type] = yield latexToPdf_1.latexToPdf(sheet["latex"]);
                }
                catch (Ex) {
                    console.log(Ex);
                }
            }
            else if (type === "odt" || type === "docx") {
                sheet[type] = yield latexToOOO_1.latexToOOO(sheet["latex"], { type: type });
            }
        }
        else if (type !== 'json') {
            sheet[type] = wsExporter_1.wsExporter(adt, type, exporterOpts);
        }
        return sheet;
    });
}
exports.generateSheet = generateSheet;
//# sourceMappingURL=generateSheet.js.map