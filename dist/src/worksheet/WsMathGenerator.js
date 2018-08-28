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
const WsGenerator_1 = require("../util/WsGenerator");
const path = require("path");
const importClassesFromDirectories_1 = require("../util/importClassesFromDirectories");
const Random_1 = require("../util/Random");
const wsMath_1 = require("../math/wsMath");
const vm = require("vm");
// Utility
function callOptionalFun(obj, fun, params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fun) {
            return yield fun.call(obj, ...params);
        }
        return null;
    });
}
// Load all generators
let topics;
let typesArray;
if (process.argv[1].endsWith(".ts")) {
    typesArray = [".ts", ".js"];
    topics = path.resolve('./src/topics/');
}
else {
    typesArray = [".js"];
    topics = path.resolve('./dist/src/topics/');
}
console.log("WsMathGenerator:: Loading generator classes from ", topics, "...");
const genClasses = importClassesFromDirectories_1.importClassesFromDirectories([path.join(topics, '/algebra/**/*.ts'),
    path.join(topics, '/algebra/**/*.js'),
    path.join(topics, '/arithmetics/**/*.ts'),
    path.join(topics, '/arithmetics/**/*.js'),
    path.join(topics, '/calculus/**/*.ts'),
    path.join(topics, '/calculus/**/*.js'),
    path.join(topics, '/geometry/2d/**/*.ts'),
    path.join(topics, '/geometry/2d/**/*.js'),
    path.join(topics, '/geometry/3d/**/*.ts'),
    path.join(topics, '/geometry/3d/**/*.js'),
    path.join(topics, '/probability/**/*.ts'),
    path.join(topics, '/probability/**/*.js'),
    path.join(topics, '/statistics/**/*.ts'),
    path.join(topics, '/statistics/**/*.js'),
    path.join(topics, '/special/**/*.ts'),
    path.join(topics, '/special/**/*.js')
], typesArray);
console.log(genClasses.map((clazz) => clazz.name).join(", "));
console.log("WsMathGenerator:: Done loading classes.");
class WsMathGenerator {
    constructor(wsGenOpts) {
        this.showKeys = 0; //0=none; 1=first keys; 2=all keys; -1=first step; -2=all steps
        this.wsGenOpts = wsGenOpts;
        if (!this.wsGenOpts.rand) {
            const seed = this.wsGenOpts.seed || new Date().getTime().toString(36);
            this.rand = new Random_1.Random(seed);
            wsGenOpts.rand = this.rand;
        }
        wsGenOpts.uniqueQuestionsMap = {};
    }
    create(worksheet) {
        return __awaiter(this, void 0, void 0, function* () {
            this.worksheet = worksheet;
            const adt = {
                lang: worksheet.lang || "en",
                title: worksheet.title || "",
                instructions: worksheet.instructions || "",
                sid: worksheet.sid,
                seed: this.rand.seed,
                fullname: worksheet.fullname || "",
                author: worksheet.author || "",
                created: new Date(),
                sections: null,
                activities: null
            };
            const promises = [];
            if (worksheet.sectionless) {
                adt.activities = [];
                worksheet.sections.forEach((wsection) => {
                    wsection.activities.forEach((wactivity) => {
                        wactivity.parent = wsection;
                        const activity = this.buildActivity(wactivity);
                        adt.activities.push(activity);
                        wactivity.questions.forEach((wquestion) => {
                            wquestion.parent = wactivity;
                            const p = this.buildQuestions(wquestion);
                            promises.push(p);
                            p.then((questions) => activity.questions.push(...questions));
                        });
                    });
                });
            }
            else {
                adt.sections = [];
                worksheet.sections.forEach((wsection) => {
                    const section = {
                        title: wsection.name,
                        activities: []
                    };
                    adt.sections.push(section);
                    wsection.activities.forEach((wactivity) => {
                        wactivity.parent = wsection;
                        const activity = this.buildActivity(wactivity);
                        section.activities.push(activity);
                        wactivity.questions.forEach((wquestion) => {
                            wquestion.parent = wactivity;
                            const p = this.buildQuestions(wquestion);
                            promises.push(p);
                            p.then((questions) => activity.questions.push(...questions));
                        });
                    });
                });
            }
            yield Promise.all(promises);
            return adt;
        });
    }
    // Build an ActivityTree and parse the scope
    buildActivity(wActivity) {
        let formulation = wActivity.formulation;
        // Eval scope in a context     
        if (wActivity.scope && Object.keys(wActivity.scope).length) {
            try {
                const context = { rnd: this.rand, ws: wsMath_1.wsMath, Math: Math };
                vm.createContext(context);
                // Must evaluate this scope into objects
                for (let key in wActivity.scope) {
                    vm.runInContext(key + "=" + wActivity.scope[key], context);
                    wActivity.scope[key] = context[key];
                }
                // Finally eval formulation into the given scope
                vm.runInContext("_formulation = \`" + formulation + "\`", context);
                formulation = context["_formulation"];
            }
            catch (Ex) {
                console.log(Ex);
            }
        }
        return {
            formulation: formulation,
            questions: []
        };
    }
    // Build a QuestionTree and call the generator classes
    buildQuestions(wQuestion) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = [];
            const promises = [];
            let qsClass = (WsGenerator_1.Container[wQuestion.gen] || {}).clazz;
            // Special generators only allow for one repetition
            if (wQuestion.gen.indexOf("special/") === 0) {
                wQuestion.repeat = 1;
            }
            if (qsClass) {
                const qGenOpts = {
                    rand: this.rand,
                    scope: wQuestion.parent.scope,
                    question: wQuestion.options
                };
                let qsGen;
                for (let i = 0; i < wQuestion.repeat; i++) {
                    qsGen = new qsClass(qGenOpts);
                    const p1 = qsGen.getFormulation();
                    const p2 = qsGen.getAnswer();
                    const p3 = callOptionalFun(qsGen, qsClass.getSteps);
                    const p4 = callOptionalFun(qsGen, qsClass.getQuizz);
                    promises.push(p1);
                    promises.push(p2);
                    promises.push(p3);
                    promises.push(p4);
                    const q = {
                        formulation: "",
                        answer: "",
                        steps: "",
                        quizz: ""
                    };
                    p1.then((formulation) => q.formulation = formulation);
                    p2.then((answer) => q.answer = answer);
                    p3.then((steps) => q.steps = steps);
                    p4.then((quizz) => q.quizz = quizz);
                    questions.push(q);
                }
            }
            else {
                console.log("Error:: generator class for ", wQuestion, " not found");
            }
            yield Promise.all(promises);
            return questions;
        });
    }
}
exports.WsMathGenerator = WsMathGenerator;
//# sourceMappingURL=WsMathGenerator.js.map