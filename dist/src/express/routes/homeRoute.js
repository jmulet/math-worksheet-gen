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
const editorRoute_1 = require("./editorRoute");
function homeRoute(router, options) {
    let url = (options.basePrefix || '');
    router.get(url, function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const amTeacher = req["session"].user && req["session"].user.idRole < 200;
            const publicTemplates = yield options.storage.load();
            res.render("home.ejs", {
                templates: publicTemplates || [],
                amTeacher: amTeacher,
                formatDate: editorRoute_1.formatDate
            });
        });
    });
}
exports.homeRoute = homeRoute;
//# sourceMappingURL=homeRoute.js.map