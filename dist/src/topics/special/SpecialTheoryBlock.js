"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const WsGenerator_1 = require("../../util/WsGenerator");
const Random_1 = require("../../util/Random");
const vm = require("vm");
function evalInContext(str, context) {
    let evaluated = "";
    try {
        vm.runInContext("_evaluated = \`" + str + "\`", context);
        evaluated = context["_evaluated"];
    }
    catch (Ex) {
        console.log(Ex);
    }
    return evaluated;
}
let SpecialTheoryBlock = class SpecialTheoryBlock {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        this.name = "special/theoryblock";
        const rnd = qGenOpts.rand || new Random_1.Random();
        const scope = qGenOpts.scope;
        const r = qGenOpts.question.interval || 10;
        this.qFormulation = qGenOpts.question.qFormulation || "";
    }
    getFormulation(format) {
        if (format === "html") {
            return '<div style="background:rgb(200,200,255); border:1px solid blue; padding:5px">' +
                this.qFormulation + "</div>";
        }
        else {
            return this.qFormulation;
        }
    }
    getAnswer() {
        // Skip this answer      
        return null;
    }
};
SpecialTheoryBlock = __decorate([
    WsGenerator_1.WsGenerator({
        category: "special/theoryblock",
        parameters: [
            {
                name: "qFormulation",
                defaults: "",
                description: "text that will appear in a box"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], SpecialTheoryBlock);
exports.SpecialTheoryBlock = SpecialTheoryBlock;
//# sourceMappingURL=SpecialTheoryBlock.js.map