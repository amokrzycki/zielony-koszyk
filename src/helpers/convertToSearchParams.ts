export const convertToSearchParams = (
  params: Record<string, string>,
): URLSearchParams => {
  return new URLSearchParams(params);
};
