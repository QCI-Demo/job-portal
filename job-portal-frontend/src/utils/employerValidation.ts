export interface JobFormValues {
  title: string;
  description: string;
  location: string;
  category: string;
}

export interface JobFormErrors {
  title?: string;
  description?: string;
  location?: string;
}

export function validateJobForm(values: JobFormValues): JobFormErrors {
  const errors: JobFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.location.trim()) {
    errors.location = 'Location is required';
  }

  return errors;
}

export function hasJobFormErrors(errors: JobFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
