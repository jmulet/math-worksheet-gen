import { QuizzStruct } from "./QuizzStruct";

export interface QuestionGenInterface {
    name?: string;
    getFormulation(type?: string): string;
    getAnswer(type?: string): string;
    getSteps?(type?: string): string;
    getQuizz?(type?: string): QuizzStruct;
    getDistractors?(type?: string): string[];
}