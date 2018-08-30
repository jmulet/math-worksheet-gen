import { ActivityOptsInterface } from './ActivityOptsInterface';

export interface QuestionOptsInterface extends ActivityOptsInterface {
    question?: any;  
    lang?: string;
}