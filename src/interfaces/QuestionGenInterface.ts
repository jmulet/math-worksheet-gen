export interface QuestionGenInterface {
    getFormulation(type?: string): string,
    getAnswer(type?: string): string,
    getDistractors(type?: string): string[]
}