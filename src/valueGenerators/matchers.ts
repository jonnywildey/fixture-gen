export const matchesId = (name: string) => {
  return name.includes("Id") || name === "id";
};

export const matcheslastName = (name: string) => {
  return name.includes("lastName");
};

export const matchesName = (name: string) => {
  return name.toLowerCase().includes("name");
};

export const matchesLine = (name: string) => {
  return name.toLowerCase().includes("line");
};

export const matchesPostcode = (name: string) => {
  return name.toLowerCase().includes("postcode");
};

export const matchesCity = (name: string) => {
  return name.toLowerCase().includes("city");
};

export const matchesCountry = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return lowerCaseName.includes("country") || lowerCaseName.includes("nation");
};

export const matchesPhone = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return (
    lowerCaseName.includes("phone") ||
    lowerCaseName.includes("mobile") ||
    lowerCaseName.includes("landline")
  );
};

export const matchesEmail = (name: string) => {
  return name.toLowerCase().includes("email");
};

export const matchesDate = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  return (
    lowerCaseName.includes("date") ||
    lowerCaseName.includes("time") ||
    name.includes("On") ||
    name.includes("At")
  );
};
