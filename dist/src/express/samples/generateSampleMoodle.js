module.exports = function generateMoodleSample() {
    var body = {
        worksheet: {
            includeKeys: true,
            title: "Moodle test",
            sections: [
                {
                    name: "Coniques", activities: [
                        {
                            formulation: "Calcula l'excentricitat",
                            questions: [
                                { gen: "geometry/conics/excentricity", repeat: 6, options: { interval: 5 } }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    return body;
};
//# sourceMappingURL=generateSampleMoodle.js.map