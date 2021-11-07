const formValidation = (data, headings) => {
  const requiredHeadings = headings.filter((h) => h.required);
  const missingFields = requiredHeadings.filter((h) => data[h.uid] == null || data[h.uid] === '');
  if (missingFields.length > 0)
    return {
      error: `Missing the following fields: ${missingFields.map((h) => h.uid).join(', ')}`,
      fields: missingFields.map((h) => h.uid),
    };
  const hasAllRequired = requiredHeadings.every((h) => data[h.uid] != null);
  if (!hasAllRequired) return { error: 'Missing required fields' };
  return data && hasAllRequired;
};

export default formValidation;
