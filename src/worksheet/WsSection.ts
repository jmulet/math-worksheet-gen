import { WsActivity } from "./WsActivity";
import { SectionOptsInterface } from "../interfaces/SectionOptsInterface";
import { Vector } from "../math/Vector";
const vm = require('vm');

export class WsSection {

    activities: WsActivity[] = [];

    constructor(private title: string, private opts: SectionOptsInterface) {
    }

    createActivity(formulation: string, scope?: any) {
        console.log(scope, formulation);
        if (scope) {            
            const context: any = {rnd: this.opts.rand, Vector: Vector};
            vm.createContext(context);

            // Must evaluate this scope into objects
            for (let key in scope) {
                vm.runInContext(key + "=" + scope[key], context);
                scope[key] = context[key];
            }

            // Finally eval formulation into the given scope
            vm.runInContext("_formulation = \`" + formulation + "\`", context);
            formulation = context["_formulation"];
        } 
        console.log("AFTER")
        console.log(scope, formulation);
        const activity = new WsActivity(formulation, {scope: scope, ...this.opts});
        this.activities.push(activity);
        return activity;
    }

    toLaTeX(): string[] {
        const latex = [];
        latex.push("  \\section{" + this.title + "}");
        latex.push("     \\begin{enumerate}[resume]");
        this.activities.forEach( (activity) => {
            latex.push(...activity.toLaTeX());
        })
        latex.push("     \\end{enumerate}");
        latex.push(" ");
        return latex;
    }

    answersToLaTeX(): string[] {
        const latex = [];
        this.activities.forEach( (activity) => {
            latex.push(...activity.answersToLaTeX());
        })
        return latex;
    }

    toHtml(): string[] {
        const latex = [];
        latex.push("<ol>")
        latex.push("  <li><h3><b>" + this.title + "</b></h3></li>");
        latex.push("  <ol>");
        this.activities.forEach( (activity) => {
            latex.push(...activity.toHtml());
        })
        latex.push("  </ol>"); 
        latex.push("</ol>"); 
        return latex;
    }

    answersToHtml(): string[] {
        const latex = [];
        latex.push("<ol>");
        this.activities.forEach( (activity) => {           
            latex.push(...activity.answersToHtml());            
        });
        latex.push("</ol>");
        return latex;
    }
}