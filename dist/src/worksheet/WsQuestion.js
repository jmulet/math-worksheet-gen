"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WsQuestion {
    constructor(qsClass, qsGenOpts) {
        this.qsClass = qsClass;
        this.qsGenOpts = qsGenOpts;
        this.qsGen = new qsClass(qsGenOpts);
    }
    toLaTeX() {
        return this.qsGen.getFormulation("latex");
    }
    answerToLaTeX() {
        return this.qsGen.getAnswer("latex");
    }
    toHtml() {
        return this.qsGen.getFormulation("html");
    }
    answerToHtml() {
        return this.qsGen.getAnswer("html");
    }
}
exports.WsQuestion = WsQuestion;
//# sourceMappingURL=WsQuestion.js.map