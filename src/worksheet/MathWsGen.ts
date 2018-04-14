 
import { WsSection } from "./WsSection";
import { WsOptsInterface } from "../interfaces/WsOptsInterface";
import  * as Random from 'random-seed';
import { RuffiniGen } from "../topics/algebra/RuffiniGen";
import { FractionOpGen } from "../topics/arithmetics/FractionOpGen";

export enum WsExportFormats {
    LATEX = 0,
    HTML = 1,
    PDF = 2,    
}

export const WsTopics = {
    Algebra: {
        Ruffini: RuffiniGen
    },
    Arithmetics: {
        FractionOp: FractionOpGen
    }
};
 
export class MathWsGen { 
    rand: Random.RandomSeed;
    showKeys: boolean = false;
    sections: WsSection[] = [];
    wsGenOpts: WsOptsInterface | undefined;

 
    constructor(wsGenOpts?: WsOptsInterface) {
        this.wsGenOpts = wsGenOpts;
        if (!wsGenOpts.rand) {
            const seed = (wsGenOpts.seed || new Date().getTime()).toString(36);
            this.rand = Random.create(seed);
            wsGenOpts.rand = this.rand;
        }
    }
    
    addSection(title: string): WsSection {
        const section = new WsSection(title, {rand: this.rand});
        this.sections.push(section);
        return section;
    }

    includeKeys(showKeys: boolean) {
        this.showKeys = showKeys;
        return this;
    }

    exportAs(format: WsExportFormats) {
        const latex = [
            "\\documentclass[a4paper]{book}",
            "\\begin{document}"
        ];
        this.sections.forEach((section) => {
            latex.push(...section.toLaTeX());
        })

        if (this.showKeys) {
            latex.push("  \\begin{section}{Answers}");
            latex.push("     \\begin{itemize}");
            this.sections.forEach((section) => {
                latex.push(...section.answersToLaTeX());
            });
            latex.push("     \\end{itemize}");
            latex.push("  \\end{section}");
        }

        latex.push("\\end{document}");
        return latex.join("\n");
    }    
}