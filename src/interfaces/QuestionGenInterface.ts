export interface QuestionGenInterface {
    name?: string;
    getFormulation(type?: string): string;
    getAnswer(type?: string): string;
    getDistractors(type?: string): string[];
}