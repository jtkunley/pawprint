import { z } from 'zod';

export const ValidationIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

/** Shape of every non-2xx JSON response from the API. */
export const ApiErrorSchema = z
  .object({
    statusCode: z.int().meta({ example: 404 }),
    error: z.string().meta({ example: 'Not Found' }),
    message: z.string().meta({ example: 'Pet "pet-999" was not found' }),
    issues: z.array(ValidationIssueSchema).optional(),
  })
  .meta({ id: 'ApiError' });
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;

export const HealthSchema = z
  .object({
    status: z.literal('ok'),
  })
  .meta({ id: 'Health' });
export type Health = z.infer<typeof HealthSchema>;

export const DemoResetResultSchema = z
  .object({
    pets: z.int().nonnegative(),
    applications: z.int().nonnegative(),
  })
  .meta({ id: 'DemoResetResult' });
export type DemoResetResult = z.infer<typeof DemoResetResultSchema>;

/** Flattens Zod issues into `{ path, message }` pairs keyed by dotted field path. */
export function toValidationIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}
