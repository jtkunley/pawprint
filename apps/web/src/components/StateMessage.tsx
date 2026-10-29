import type { ReactNode } from 'react';
import { PawIcon } from './PawIcon';

interface StateMessageProps {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'error';
  /** Use `h1` when the message replaces the whole page content. */
  headingLevel?: 'h1' | 'h2';
}

/** Shared layout for empty, error, and not-found states. Errors are announced to screen readers. */
export function StateMessage({
  title,
  children,
  action,
  tone = 'neutral',
  headingLevel: Heading = 'h2',
}: StateMessageProps) {
  return (
    <div
      className={`state-message state-message--${tone}`}
      role={tone === 'error' ? 'alert' : undefined}
    >
      <span className="state-message__icon">
        <PawIcon size={32} />
      </span>
      <Heading className="state-message__title">{title}</Heading>
      {children && <div className="state-message__body">{children}</div>}
      {action && <div className="state-message__action">{action}</div>}
    </div>
  );
}
