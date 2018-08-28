import { QuizzStruct } from "./QuizzStruct";

export interface QuestionGenInterface {
    name?: string;
    getFormulation(): string;
    getAnswer(): string;
    getSteps?(): string;
    getQuizz?(): QuizzStruct;
}