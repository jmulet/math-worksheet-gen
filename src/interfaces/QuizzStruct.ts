export interface QuizzOption {
    html: string;   //html content to define the option
    grade: number;  //grade like 100, -100/3, etc...
}


export interface QuizzStruct {
    type: "numerical" | "cloze" | "multiplechoice" | "shortanswer";               // numerical, cloze, multiplechoice, shortanswer
    answer?: string;            // For numerical or shortanswer
    accuracy?: number;          // For numerical
    options?: QuizzOption[];    // For multiplechoice
    html?: string;              // For cloze: used to define input method
}