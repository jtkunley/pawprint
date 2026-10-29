import {
  type CreateAdoptionApplication,
  CreateAdoptionApplicationSchema,
  HOME_TYPES,
  type HomeType,
  type Pet,
} from '@pawprint/contracts';
import { type FormEvent, useId, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { homeTypeLabels } from '../lib/format';

type Field = 'applicantName' | 'email' | 'homeType' | 'message';
type FieldErrors = Partial<Record<Field, string>>;

interface FormValues {
  applicantName: string;
  email: string;
  homeType: HomeType | '';
  hasOtherPets: boolean;
  message: string;
}

const INITIAL_VALUES: FormValues = {
  applicantName: '',
  email: '',
  homeType: '',
  hasOtherPets: false,
  message: '',
};

const FIELD_ORDER: Field[] = ['applicantName', 'email', 'homeType', 'message'];

export interface AdoptionFormProps {
  pet: Pick<Pet, 'id' | 'name'>;
  onSubmit: (application: CreateAdoptionApplication) => void;
  isSubmitting?: boolean;
  /** Error from the last submission attempt. 400 issues are shown next to their fields. */
  error?: Error | null;
}

function firstErrorPerField(issues: { path: string; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const { path, message } of issues) {
    if ((FIELD_ORDER as string[]).includes(path)) errors[path as Field] ??= message;
  }
  return errors;
}

export function AdoptionForm({ pet, onSubmit, isSubmitting = false, error }: AdoptionFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [editedSinceSubmit, setEditedSinceSubmit] = useState<ReadonlySet<string>>(new Set());

  const serverIssues = error instanceof ApiError && error.status === 400 ? error.body?.issues : undefined;
  const serverErrors = firstErrorPerField(
    (serverIssues ?? []).filter((issue) => !editedSinceSubmit.has(issue.path)),
  );
  const errors: FieldErrors = { ...serverErrors, ...clientErrors };
  const formError = error && !serverIssues?.length ? submissionErrorMessage(error) : null;

  const update = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setEditedSinceSubmit((current) => new Set(current).add(field));
    setClientErrors((current) => {
      const next = { ...current };
      delete next[field as Field];
      return next;
    });
  };

  const focusField = (field: Field) => {
    const element = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    element?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setEditedSinceSubmit(new Set());
    const result = CreateAdoptionApplicationSchema.safeParse({ ...values, petId: pet.id });

    if (!result.success) {
      const nextErrors = firstErrorPerField(
        result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      );
      setClientErrors(nextErrors);
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) focusField(firstInvalid);
      return;
    }

    setClientErrors({});
    onSubmit(result.data);
  };

  const describedBy = (field: Field, hint?: boolean) =>
    [hint && `${id}-${field}-hint`, errors[field] && `${id}-${field}-error`].filter(Boolean).join(' ') ||
    undefined;

  const fieldError = (field: Field) =>
    errors[field] && (
      <p className="field__error" id={`${id}-${field}-error`}>
        {errors[field]}
      </p>
    );

  return (
    <form
      ref={formRef}
      className="adoption-form"
      aria-labelledby={`${id}-title`}
      noValidate
      onSubmit={handleSubmit}
    >
      <h2 id={`${id}-title`} className="adoption-form__title">
        Apply to adopt {pet.name}
      </h2>
      <p className="adoption-form__intro">
        Tell us a little about yourself. Our team reviews every application personally.
      </p>

      <div className="field">
        <label htmlFor={`${id}-applicantName`}>Full name</label>
        <input
          id={`${id}-applicantName`}
          name="applicantName"
          type="text"
          autoComplete="name"
          value={values.applicantName}
          aria-invalid={Boolean(errors.applicantName)}
          aria-describedby={describedBy('applicantName')}
          onChange={(event) => update('applicantName', event.target.value)}
        />
        {fieldError('applicantName')}
      </div>

      <div className="field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy('email')}
          onChange={(event) => update('email', event.target.value)}
        />
        {fieldError('email')}
      </div>

      <fieldset className="field" aria-describedby={describedBy('homeType')}>
        <legend>Home type</legend>
        <div className="choice-group">
          {HOME_TYPES.map((homeType) => (
            <label key={homeType} className="choice">
              <input
                type="radio"
                name="homeType"
                value={homeType}
                checked={values.homeType === homeType}
                aria-invalid={Boolean(errors.homeType)}
                onChange={() => update('homeType', homeType)}
              />
              {homeTypeLabels[homeType]}
            </label>
          ))}
        </div>
        {fieldError('homeType')}
      </fieldset>

      <label className="choice">
        <input
          type="checkbox"
          name="hasOtherPets"
          checked={values.hasOtherPets}
          onChange={(event) => update('hasOtherPets', event.target.checked)}
        />
        I have other pets at home
      </label>

      <div className="field">
        <label htmlFor={`${id}-message`}>Why would you be a great match?</label>
        <p className="field__hint" id={`${id}-message-hint`}>
          At least 20 characters. Mention your routine, experience, or anything else we should know.
        </p>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message', true)}
          onChange={(event) => update('message', event.target.value)}
        />
        {fieldError('message')}
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="button button--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending application…' : 'Send application'}
      </button>
    </form>
  );
}

function submissionErrorMessage(error: Error): string {
  if (error instanceof ApiError && error.status === 409) return error.message;
  if (error instanceof ApiError && error.status === 404) {
    return 'This pet is no longer listed. Please choose another pet.';
  }
  return 'We could not send your application. Please check your connection and try again.';
}
