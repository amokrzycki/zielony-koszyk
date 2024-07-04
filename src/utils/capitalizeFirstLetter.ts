function capitalizeFirstLetter(str: string | undefined): string | undefined {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default capitalizeFirstLetter;
