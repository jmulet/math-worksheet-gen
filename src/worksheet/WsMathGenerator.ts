import { Worksheet, WsMathGenOpts } from '../interfaces/WsMathGenOpts';
import { Container } from '../util/WsGenerator';
import * as path from 'path';
import { importClassesFromDirectories } from '../util/importClassesFromDirectories';
import { Random } from '../util/Random';
import { AbstractDocumentTree, ActivityTree, SectionTree, QuestionTree } from '../interfaces/AbstractDocumentTree';
import { QuestionGenInterface } from '../interfaces/QuestionGenInterface';
import { wsMath } from '../math/wsMath';
import * as vm from 'vm';
import { QuestionOptsInterface } from '../interfaces/QuestionOptsInterface';

// Utility
function callOptionalFun(obj: any, fun: Function, params?: any[]): any {     
    if (fun) {
        return fun.call(obj, ...params);
    } 
    return null;
}

// Load all generators
let topics;

let typesArray; 
if (process.argv[1].endsWith(".ts"))  {
    typesArray = [".ts", ".js"];
    topics = path.resolve('./src/topics/')
} else {
    typesArray = [".js"];
    topics = path.resolve('./dist/src/topics/')
}

console.log("WsMathGenerator:: Loading generator classes from ", topics ,"...");
const genClasses = importClassesFromDirectories([path.join(topics,'/algebra/**/*.ts'), 
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
console.log(genClasses.map( (clazz) => clazz.name ).join(", "));
console.log("WsMathGenerator:: Done loading classes.");

 
export class WsMathGenerator { 
    worksheet: Worksheet;
    rand: Random;
    showKeys: number = 0;   //0=none; 1=first keys; 2=all keys; -1=first step; -2=all steps
    wsGenOpts: WsMathGenOpts;
    uid: string;

 
    constructor(wsGenOpts?: WsMathGenOpts) {
        this.wsGenOpts = wsGenOpts;
        if (!wsGenOpts.rand) {
            const seed = (wsGenOpts.seed || new Date().getTime()).toString(36);
            this.rand = new Random(seed);
            wsGenOpts.rand = this.rand;
        }
        wsGenOpts.uniqueQuestionsMap = {};
    }

    create(worksheet: Worksheet): AbstractDocumentTree  {
        this.worksheet = worksheet;
        const adt = <AbstractDocumentTree> {
            lang: worksheet.lang || "en",
            title: worksheet.title || "",
            instructions: worksheet.instructions || "",
            sid: worksheet.sid,
            seed: this.rand.seed,
            fullname: worksheet.fullname || "",
            author: worksheet.author || "",
            created: new Date(),
            sections: null,
            activities: null
        };  
        
        if (worksheet.sectionless) {
            adt.activities = <ActivityTree[]>[];
            worksheet.sections.forEach( (wsection) => {                
                wsection.activities.forEach( (wactivity) => {
                    wactivity.parent = wsection; 
                    const activity = this.buildActivity(wactivity);
                    adt.activities.push(activity);
                    wactivity.questions.forEach( (wquestion) => {
                        wquestion.parent = wactivity;
                        const questions = this.buildQuestions(wquestion);
                        activity.questions.push(...questions);
                    });
                })
            });
        } else {
            adt.sections = <SectionTree[]>[];
            worksheet.sections.forEach( (wsection) => {
                const section: SectionTree = {
                    title: wsection.name,
                    activities: []
                };
                adt.sections.push(section);
                wsection.activities.forEach( (wactivity) => {
                    wactivity.parent = wsection; 
                    const activity = this.buildActivity(wactivity);
                    section.activities.push(activity);
                    wactivity.questions.forEach( (wquestion) => {
                        wquestion.parent = wactivity;
                        const questions = this.buildQuestions(wquestion);
                        activity.questions.push(...questions);
                    });
                })
            });
        }
        return adt;
    }

    // Build an ActivityTree and parse the scope
    private buildActivity(wActivity): ActivityTree {
        
        let formulation = wActivity.formulation;
        
        // Eval scope in a context     
        if (wActivity.scope && Object.keys(wActivity.scope).length) {            
            try {
                const context: any = {rnd: this.rand, ws: wsMath, Math: Math};
                vm.createContext(context);

                // Must evaluate this scope into objects
                for (let key in wActivity.scope) {
                    vm.runInContext(key + "=" + wActivity.scope[key], context);
                    wActivity.scope[key] = context[key];
                }

                // Finally eval formulation into the given scope
                vm.runInContext("_formulation = \`" + formulation + "\`", context);
                formulation = context["_formulation"];
            } catch(Ex) {
                console.log(Ex);
            }
        }            
        return {
            formulation: formulation,
            questions: []
        }
    }


    // Build a QuestionTree and call the generator classes
    private buildQuestions(wQuestion): QuestionTree[] {
        const questions = <QuestionTree[]>[];

        let qsClass = (Container[wQuestion.gen] || {}).clazz;
        // Special generators only allow for one repetition
        if (wQuestion.gen.indexOf("special/") === 0) {
            wQuestion.repeat = 1;
        }
        if (qsClass) {
            wQuestion.options.uniqueQuestionsMap = this.wsGenOpts.uniqueQuestionsMap; 
 
            const qGenOpts: QuestionOptsInterface = {
                rand: this.rand,
                scope: wQuestion.parent.scope,
                question: wQuestion.options
            };

            let qsGen;
            for (let i = 0; i < wQuestion.repeat || 1 ; i++ ) {                
                qsGen = <QuestionGenInterface> new qsClass(qGenOpts);                     
                questions.push({
                    formulation: qsGen.getFormulation(),
                    answer: qsGen.getAnswer(),
                    steps: <string> callOptionalFun(qsGen, qsClass.getSteps),
                    quizz: <string> callOptionalFun(qsGen, qsClass.getQuizz)
                });
            } 
        } else {
            console.log("Error:: generator class for ", wQuestion, " not found");
        }

        return questions;
    }

}

  