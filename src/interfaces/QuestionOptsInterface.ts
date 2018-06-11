import  * as Random from 'random-seed';
import { SectionOptsInterface } from './SectionOptsInterface';
import { ActivityOptsInterface } from './ActivityOptsInterface';

export interface QuestionOptsInterface extends ActivityOptsInterface {
    question?: any;  
}