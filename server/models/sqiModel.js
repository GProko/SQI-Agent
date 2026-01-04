
const IMPORTANCE = { 'A': 1.0, 'B': 0.7, 'C': 0.5 };
const DIFFICULTY = { 'Easy': 0.6, 'Medium': 1.0, 'Hard': 1.4 };
const TYPE_W = { 'Practical': 1.1, 'Theory': 1.0 };

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const generateReasons = (att, score) => {
    let reasons = [];
    if (!att.correct) reasons.push("Wrong answer");
    if (att.importance === 'A') reasons.push("High Importance (A)");
  
    if (att.time_spent_sec < att.expected_time_sec * 0.7) reasons.push("Rushed answer");
    if (score > 0.8) reasons.push("High priority for review");
    return reasons;
};

const calculateSQI = (attempts) => {
    let totalWeightedScore = 0;
    let totalMaxPossibleScore = 0;
    
    let topicScores = {}; 
    let conceptScores = []; 
    let rankedConcepts = [];

    attempts.forEach(att => {
      
        let base = att.correct ? att.marks : -Math.abs(att.neg_marks);

      
        const imp_w = IMPORTANCE[att.importance] || 1.0;
        const diff_w = DIFFICULTY[att.difficulty] || 1.0;
        const type_w = TYPE_W[att.type] || 1.0;

        let weighted = base * imp_w * diff_w * type_w;
        let maxWeighted = att.marks * imp_w * diff_w * type_w;

      
      
        if (att.time_spent_sec > (1.5 * att.expected_time_sec)) 
            {
                weighted *= 0.9;
            }
        if (att.time_spent_sec > (2.0 * att.expected_time_sec)){

            weighted *= 0.8;

        }
            
      
        if (att.marked_review && !att.correct) {
            weighted *= 0.9;
        }

        if (att.revisits > 0 && att.correct) {
            weighted += (0.2 * att.marks);
        }

       
        totalWeightedScore += weighted;
        totalMaxPossibleScore += maxWeighted;

      
        if (!topicScores[att.topic])
            { 
                topicScores[att.topic] = { earned: 0, max: 0 };
            }
        topicScores[att.topic].earned += weighted;
        topicScores[att.topic].max += maxWeighted;

        const conceptSQI = maxWeighted > 0 ? (weighted / maxWeighted) * 100 : 0;
        
        conceptScores.push({
            topic: att.topic,
            concept: att.concept,
            sqi: parseFloat(clamp(conceptSQI, 0, 100).toFixed(2))
        });

      
        const w_wrong = att.correct ? 0 : 1;
        const w_imp = IMPORTANCE[att.importance] || 0.5;
        
        let w_time = 0.7; 
        const timeRatio = att.time_spent_sec / att.expected_time_sec;
        if (timeRatio < 0.7) w_time = 1.0; 
        else if (timeRatio > 1.2) w_time = 0.4; 

        const w_quality = 1 - (clamp(conceptSQI, 0, 100) / 100);

       
        const priorityScore = (0.4 * w_wrong) + (0.25 * w_imp) + (0.20 * w_time) + (0.15 * w_quality);

        rankedConcepts.push({
            topic: att.topic,
            concept: att.concept,
            weight: parseFloat(priorityScore.toFixed(2)),
            reasons: generateReasons(att, priorityScore)
        });
    });

    
    let overallSQI = 0;
    if (totalMaxPossibleScore > 0) {
        overallSQI = (totalWeightedScore / totalMaxPossibleScore) * 100;
    }

    const formattedTopicScores = Object.keys(topicScores).map(topic => {
        const t = topicScores[topic];
        const t_sqi = t.max > 0 ? (t.earned / t.max) * 100 : 0;
        return { topic, sqi: parseFloat(clamp(t_sqi, 0, 100).toFixed(2)) };
    });

    
    rankedConcepts.sort((a, b) => b.weight - a.weight);

    return {
        overall_sqi: parseFloat(clamp(overallSQI, 0, 100).toFixed(2)),
        topic_scores: formattedTopicScores,
        concept_scores: conceptScores,
        ranked_concepts_for_summary: rankedConcepts
    };
};

module.exports = { calculateSQI };