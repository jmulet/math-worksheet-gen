import { WsActivity } from "./WsActivity";
import { SectionOptsInterface } from "../interfaces/SectionOptsInterface";

export class WsSection {

    activities: WsActivity[] = [];

    constructor(private title: string, private opts: SectionOptsInterface) {
    }

    createActivity(formulation: string, context?: any) {
        const activity = new WsActivity(formulation, {context: context, ...this.opts});
        this.activities.push(activity);
        return activity;
    }

    toLaTeX(): string[] {
        const latex = [];
        latex.push("  \\begin{section}{" + this.title + "}");
        latex.push("  \\begin{itemize}");
        this.activities.forEach( (activity) => {
            latex.push(...activity.toLaTeX());
        })
        latex.push("  \\end{itemize}");
        latex.push("  \\end{section}");
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