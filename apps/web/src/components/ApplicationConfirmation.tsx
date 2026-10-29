import type { AdoptionApplication } from '@pawprint/contracts';
import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router';
import { formatDate } from '../lib/format';

export function ApplicationConfirmation({ application }: { application: AdoptionApplication }) {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus here so keyboard and screen-reader users learn the form was replaced.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="confirmation" aria-labelledby={titleId}>
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>
        Application received!
      </h2>
      <p>
        Thank you, {application.applicantName}. We have your application for{' '}
        <strong>{application.petName}</strong> and will reply to{' '}
        <strong>{application.email}</strong> within two business days.
      </p>
      <dl className="confirmation__details">
        <div>
          <dt>Reference</dt>
          <dd>{application.id}</dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>{formatDate(application.submittedAt)}</dd>
        </div>
      </dl>
      <Link to="/" className="button button--secondary">
        Browse more pets
      </Link>
    </section>
  );
}
