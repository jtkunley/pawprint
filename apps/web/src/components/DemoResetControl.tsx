import { ApiError } from '../api/client';
import { useResetDemo } from '../api/hooks';

export function DemoResetControl() {
  const reset = useResetDemo();

  let message = '';
  if (reset.isSuccess) message = `Demo data restored: ${reset.data.pets} pets, no applications.`;
  if (reset.isError) {
    message =
      reset.error instanceof ApiError && reset.error.status === 404
        ? 'Demo reset is disabled in this environment.'
        : 'Could not reset demo data. Please try again.';
  }

  return (
    <div className="demo-reset">
      <button
        type="button"
        className="button button--ghost"
        disabled={reset.isPending}
        onClick={() => reset.mutate()}
      >
        {reset.isPending ? 'Resetting…' : 'Reset demo data'}
      </button>
      <p className="demo-reset__status" role="status">
        {message}
      </p>
    </div>
  );
}
