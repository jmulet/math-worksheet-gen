export interface QuestionGenInterface {
    name?: string;
    getFormulation(type?: string): string;
    getAnswer(type?: string): string;
    getSteps?(type?: string): string;
    getDistractors?(type?: string): string[];
}