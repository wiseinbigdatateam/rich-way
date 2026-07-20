import React from "react";

type Props = {
  factors: Record<string, number>;
};

const FACTOR_LABELS: Record<string, string> = {
  psychological: "심리적 요인",
  behavioral: "행동적 요인",
  financial: "재무적 요인",
  environmental: "환경적 요인",
};

const FactorsGraph: React.FC<Props> = ({ factors }) => {
  return (
    <div className="space-y-4">
      {Object.entries(factors).map(([key, value]) => (
        <div key={key} className="mb-2">
          <div className="flex items-center justify-between text-sm font-medium mb-1">
            <span>{FACTOR_LABELS[key] || key}</span>
            <span>{Math.round(value)}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactorsGraph; 