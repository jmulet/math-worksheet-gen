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
/**
 * Types that can be stored in the database structure; all other will be generated every time
 */
const STORABLE_TYPES = ["json", "latex", "html", "pdf"];
/**
 * This service is responsible for storing a given generated sheet into the database if the type is storable of course
 */
function storeGeneratedSheets(workbook, sheets, storage) {
    return __awaiter(this, void 0, void 0, function* () {
        const uid = workbook.sid;
        const seed = workbook.seed;
        const fullname = workbook.fullname;
        const promises = [];
        Object.keys(sheets).forEach((type) => {
            if (STORABLE_TYPES.indexOf(type) >= 0) {
                const sheet = sheets[type];
                promises.push(storage.saveGenerated(uid, seed, fullname, type, sheet, workbook.includeKeys));
            }
        });
        const [errs, updates] = yield Promise.all(promises);
        return updates.reduce((a, b) => a + b, 0);
    });
}
exports.storeGeneratedSheets = storeGeneratedSheets;
//# sourceMappingURL=storeGeneratedSheet.js.map