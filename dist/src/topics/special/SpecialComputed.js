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
let SpecialComputed = class SpecialComputed {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        this.name = "special/computed";
        const rnd = qGenOpts.rand || new Random_1.Random();
        const scope = qGenOpts.scope;
        const r = qGenOpts.question.interval || 10;
        this.qFormulation = qGenOpts.question.qFormulation || "";
        this.qAnswer = qGenOpts.question.qAnswer || "";
        try {
            this.qDistractors = JSON.parse(qGenOpts.question.qDistractors) || [];
        }
        catch (Ex) {
        }
        // Eval every string in a scoped context   
        const context = Object.assign({}, scope, { Math: Math });
        vm.createContext(context);
        this.qFormulation = evalInContext(this.qFormulation, context);
        this.qAnswer = evalInContext(this.qAnswer, context);
        this.qDistractors = this.qDistractors.map(e => evalInContext(e, context));
    }
    getFormulation() {
        return this.qFormulation;
    }
    getAnswer() {
        return this.qAnswer;
    }
    getDistractors() {
        return this.qDistractors;
    }
};
SpecialComputed = __decorate([
    WsGenerator_1.WsGenerator({
        category: "special/computed",
        parameters: [
            {
                name: "qFormulation",
                defaults: "",
                description: "Question formulation (have access to scope from parent activity)"
            },
            {
                name: "qAnswer",
                defaults: "",
                description: "Question Answer (have access to scope from parent activity)"
            },
            {
                name: "qDistractors",
                defaults: "[]",
                description: "Question answer distractors ['a','b','c',...] (to build a multiple-choice question)"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], SpecialComputed);
exports.SpecialComputed = SpecialComputed;
//# sourceMappingURL=SpecialComputed.js.map