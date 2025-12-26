import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const getScoreClass = () => {
    if (score >= 76) return 'score-badge-high';
    if (score >= 51) return 'score-badge-medium';
    return 'score-badge-low';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-lg font-bold';
      default:
        return 'px-3 py-1 text-sm font-semibold';
    }
  };

  return (
    <span className={cn('rounded-md inline-flex items-center justify-center', getScoreClass(), getSizeClass())}>
      {score}
    </span>
  );
}
