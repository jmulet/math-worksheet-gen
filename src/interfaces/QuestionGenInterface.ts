import { QuizzStruct } from "./QuizzStruct";
import { WsDynImg } from "./WsDynImg";

export interface QuestionGenInterface {
    name?: string;
    graphics?: WsDynImg[];
    getFormulation(): Promise<string>;
    getAnswer(): Promise<string>;
    getSteps?(): Promise<string>;
    getQuizz?(): Promise<QuizzStruct>;
}