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
}