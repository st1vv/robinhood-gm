type HomeGlobalStatsProps = {
  totalFree: number;
  totalPremium: number;
};

export const HomeGlobalStats = ({
  totalFree,
  totalPremium,
}: HomeGlobalStatsProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <StatRow label="Global GM:" value={totalFree} />
      <StatRow label="Global Premium GM:" value={totalPremium} />
    </div>
  );
};

type StatRowProps = {
  label: string;
  value: number;
};

const StatRow = ({ label, value }: StatRowProps) => {
  return (
    <div className="w-full flex items-baseline justify-between">
      <span className="w-full text-sm text-ink/60">{label}</span>
      <span className="w-full text-end font-mono text-sm font-semibold text-ink">
        {value}
      </span>
    </div>
  );
};
