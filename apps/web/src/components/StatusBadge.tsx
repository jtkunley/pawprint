import type { AdoptionStatus } from '@pawprint/contracts';
import { statusLabels } from '../lib/format';

export function StatusBadge({ status }: { status: AdoptionStatus }) {
  return <span className={`badge badge--${status}`}>{statusLabels[status]}</span>;
}
