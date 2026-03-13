const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const dotProduct = (vectorA, vectorB) => {
  return vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
};

const vectorMagnitude = (vector) => {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
};

export const cosineSimilarity = (vectorA, vectorB) => {
  const magnitudeA = vectorMagnitude(vectorA);
  const magnitudeB = vectorMagnitude(vectorB);

  if (magnitudeA === 0 && magnitudeB === 0) {
    return 1;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  const similarity = dotProduct(vectorA, vectorB) / (magnitudeA * magnitudeB);
  return clamp(similarity, 0, 1);
};

export const analyzeDrift = ({ baselineVector, currentVector }) => {
  const similarity = cosineSimilarity(baselineVector, currentVector);
  const driftScore = clamp(1 - similarity, 0, 1);
  const stabilityScore = clamp(100 - driftScore * 100, 0, 100);

  let riskLevel = "LOW";

  if (driftScore >= 0.25) {
    riskLevel = "HIGH";
  } else if (driftScore >= 0.1) {
    riskLevel = "MEDIUM";
  }

  return {
    driftScore: Number(driftScore.toFixed(4)),
    stabilityScore: Number(stabilityScore.toFixed(2)),
    riskLevel
  };
};
