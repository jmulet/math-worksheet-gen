import { Worksheet, WsMathGenOpts, QuestionWs, ActivityWs } from '../interfaces/WsMathGenOpts';
import { Container } from '../util/WsGenerator';
import * as path from 'path';
import { importClassesFromDirectories } from '../util/importClassesFromDirectories';
import { Random } from '../util/Random';
import { AbstractDocumentTree, ActivityTree, SectionTree, QuestionTree } from '../interfaces/AbstractDocumentTree';
import { QuestionGenInterface } from '../interfaces/QuestionGenInterface';
import { wsMath } from '../math/wsMath';
import * as vm from 'vm';
import { QuestionOptsInterface } from '../interfaces/QuestionOptsInterface';
import { WsDynImg } from '../interfaces/WsDynImg';

// Utility
async function callOptionalFun(obj: any, fun: Function, params?: any[]): Promise<any> {     
    if (fun) {
        return await fun.call(obj, ...params);
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

 
    constructor(wsGenOpts: WsMathGenOpts) {
        this.wsGenOpts = wsGenOpts;
        if (!this.wsGenOpts.rand) {
            const seed = this.wsGenOpts.seed || new Date().getTime().toString(36);
            this.rand = new Random(seed);
            wsGenOpts.rand = this.rand;
        }
        wsGenOpts.uniqueQuestionsMap = {};
    }

    async create(worksheet: Worksheet): Promise<AbstractDocumentTree>  {
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
            activities: null,
            graphics: []
        };  

        const promises = [];

        if (worksheet.sectionless) {
            adt.activities = <ActivityTree[]>[];
            worksheet.sections.forEach( (wsection) => {                
                wsection.activities.forEach( (wactivity) => {
                    wactivity.parent = wsection; 
                    const activity = this.buildActivity(wactivity);
                    adt.activities.push(activity);
                    wactivity.questions.forEach( (wquestion) => {
                        wquestion.parent = wactivity;
                        const p = this.buildQuestions(wquestion, {lang: adt.lang}, adt.graphics);
                        promises.push(p);
                        p.then((questions) => activity.questions.push(...questions));   
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
                        const p = this.buildQuestions(wquestion, {lang: adt.lang}, adt.graphics);
                        promises.push(p);
                        p.then((questions) => activity.questions.push(...questions));                        
                    });
                })
            });
        }
        await Promise.all(promises);
        return adt;
    }

    // Build an ActivityTree and parse the scope
    private buildActivity(wActivity: ActivityWs): ActivityTree {
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
    private async buildQuestions(wQuestion: QuestionWs, opts: any, graphics: WsDynImg[]): Promise<QuestionTree[]> {
        const questions = <QuestionTree[]>[];
        const promises = [];
        let qsClass = (Container[wQuestion.gen] || {}).clazz;
        // Special generators only allow for one repetition
        if (wQuestion.gen.indexOf("special/") === 0) {
            wQuestion.repeat = 1;
        }
        if (qsClass) { 
           const qGenOpts: QuestionOptsInterface = {
                rand: this.rand,
                scope: wQuestion.parent.scope,
                question: wQuestion.options,
                ...opts
            };

            
            for (let i = 0; i < wQuestion.repeat; i++ ) {                
                const qsGen = <QuestionGenInterface> new qsClass(qGenOpts);      
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
                p3.then((steps) => q.steps = <string> steps);
                p4.then((quizz) => q.quizz = <string> quizz);       
                
                Promise.all([p1,p2,p3,p4]).then(() => {
                    console.log(qsGen);
                    if (qsGen.graphics && Array.isArray(qsGen.graphics)) {
                        graphics.push(...qsGen.graphics);
                    }
                });
                questions.push(q);
            } 
        } else {
            console.log("Error:: generator class for ", wQuestion, " not found");
        }

        await Promise.all(promises);
         
        return questions;
    }

}

  