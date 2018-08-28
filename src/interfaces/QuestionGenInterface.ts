import { QuizzStruct } from "./QuizzStruct";

export interface QuestionGenInterface {
    name?: string;
    getFormulation(): Promise<string>;
    getAnswer(): Promise<string>;
    getSteps?(): Promise<string>;
    getQuizz?(): Promise<QuizzStruct>;
}