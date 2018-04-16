export interface QuestionGenInterface {
    getFormulation(type?: string): string,
    getAnswer(type?: string): string
}