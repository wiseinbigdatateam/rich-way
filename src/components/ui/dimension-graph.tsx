import React from "react";

type Props = {
  dimension: string;
  scores: Record<string, number>;
};

const DIMENSION_LABELS: Record<string, [string, string, string, string]> = {
  ei: ["외향(E)", "내향(I)", "E", "I"],
  sn: ["감각(S)", "직관(N)", "S", "N"],
  tf: ["사고(T)", "감정(F)", "T", "F"],
  jp: ["판단(J)", "인식(P)", "J", "P"],
};

const getPercents = (scores: Record<string, number>) => {
  const keys = Object.keys(scores);
  const total = (scores[keys[0]] ?? 0) + (scores[keys[1]] ?? 0);
  const left = Math.round(((scores[keys[0]] ?? 0) / (total || 1)) * 100);
  const right = 100 - left;
  return [left, right];
};

const DimensionGraph: React.FC<Props> = ({ dimension, scores }) => {
  const labels = DIMENSION_LABELS[dimension] || ["", "", "", ""];
  const [leftPercent, rightPercent] = getPercents(scores);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm font-medium mb-1">
        <span>{labels[0]}: {leftPercent}%</span>
        <span>{labels[1]}: {rightPercent}%</span>
      </div>
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-4 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${leftPercent}%` }}
        />
      </div>
    </div>
  );
};

export default DimensionGraph; 