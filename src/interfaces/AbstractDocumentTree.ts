export interface SectionTree {
    title: string,
    activities: ActivityTree[]
}

export interface ActivityTree {
    formulation: string,
    questions: QuestionTree[]
}

export interface QuestionTree {
    formulation: string,
    answer: string,
    steps: string,
    quizz: string
}

export interface AbstractDocumentTree {
    lang: string,
    title: string,
    instructions: string,
    sid: string,
    seed?: string,
    fullname?: string
    author: string,
    created: Date,
    sections?: SectionTree[],
    activities?: ActivityTree[]
}