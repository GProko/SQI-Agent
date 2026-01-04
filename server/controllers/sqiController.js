
const { calculateSQI } = require('../models/sqiModel');

exports.computeSQI = (req, res) => {
    try {
        const { student_id, attempts, diagnostic_prompt } = req.body;

        const results = calculateSQI(attempts);

      
        const responsePayload = {
            student_id: student_id || "Unknown",
            overall_sqi: results.overall_sqi,
            topic_scores: results.topic_scores,
            concept_scores: results.concept_scores,
            ranked_concepts_for_summary: results.ranked_concepts_for_summary,
            metadata: {
                diagnostic_prompt_version: "v1",
                computed_at: new Date().toISOString(),
                engine: "sqi-v0.1"
            }
        };

      
        res.status(200).json(responsePayload);

    } catch (error) {
        console.error(error);
        res.status(500);
    }
};