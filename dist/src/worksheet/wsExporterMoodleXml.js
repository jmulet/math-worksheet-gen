"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlBuilder = require("xmlbuilder");
function wsExporterMoodleXml(adt, opts) {
    var quiz = xmlBuilder.create('quiz', { encoding: 'utf-8' });
    this.sections.forEach((section) => {
        // Add a category           
        quiz.ele("question", { type: "category" }).ele("category").ele("text", {}, "$course$/" + section.title);
        section.activities.forEach((activity) => {
            activity.questions.forEach((question) => {
                let formulation = activity.formulation.replace("\n", "<br/>");
                formulation += ". " + question.toHtml();
                const type = question.type;
                createQuestion(quiz, formulation, type, question.answerToHtml(), question.distractorsHtml());
            });
        });
    });
    return quiz.end({ pretty: true });
}
exports.wsExporterMoodleXml = wsExporterMoodleXml;
/**
 * <question type="multichoice|truefalse|shortanswer|matching|cloze|essay|numerical|description">
 <name>
     <text>Name of question</text>
 </name>
 <questiontext format="html">
     <text>What is the answer to this question?</text>
 </questiontext>
 .
 .
 .
</question>
 * @param quiz
 * @param formulation
 * @param type
 */
const createQuestion = function (quiz, formulation, type, answer, distractors) {
    type = type || "shortanswer";
    const questionNode = quiz.ele("question", { type: type });
    questionNode.ele("name").ele("text", {}, formulation + " [" + Math.random().toString(32).substring(2) + "] ");
    questionNode.ele("questiontext", { format: "html" }).ele("text").dat(formulation);
    let answerNode;
    switch (type) {
        case ("numerical"):
            answerNode = questionNode.ele("answer", { fraction: "100", format: "moodle_auto_format" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            questionNode.ele("defaultgrade", {}, 1.0000000);
            questionNode.ele("penalty", {}, 0.3333333);
            questionNode.ele("hidden", {}, 0);
            questionNode.ele("tolerance", {}, 0.1);
            questionNode.ele("tolerancetype", {}, 1);
            break;
        case ("shortanswer"):
            answerNode = questionNode.ele("answer", { fraction: "100", format: "html" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            break;
        case ("multiplechoice"):
            // Correct answer
            answerNode = questionNode.ele("answer", { fraction: "100", format: "html" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            // Add distractors
            distractors.forEach((distract) => {
                answerNode = questionNode.ele("answer", { fraction: "-33.33333", format: "html" });
                answerNode.ele("text", {}).dat(distract);
                answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Incorrecte!");
            });
            questionNode.ele("shuffleanswers", {}, 1);
            questionNode.ele("single", {}, "true");
            questionNode.ele("answernumbering", {}, "abc");
            break;
    }
};
//# sourceMappingURL=wsExporterMoodleXml.js.map