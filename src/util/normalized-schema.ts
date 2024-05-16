export const normalizeFileFields = (obj: Record<string, any>) => {
  let routeContainsFile = false;

  if (obj.hasOwnProperty("consumes") && obj.consumes.includes("multipart/form-data")) {
    routeContainsFile = true;
  }

  for (let key in obj) {

    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (key === "body" && routeContainsFile) {
        obj[key] = {
          type: "object",
          required: ["file"],
          properties: {
            file: { type: 'file' },
          }
        };
      } else {
        normalizeFileFields(obj[key]);
      }
    }
  }

  return obj;
};
