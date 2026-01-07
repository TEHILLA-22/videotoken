export const baseUrl =
    process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:4500/api/users";
