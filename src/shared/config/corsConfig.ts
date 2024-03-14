export const CORS_CONFIG = {
  origin: "*",
  accept: ["http://localhost:3000/"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["my-custom-header"],
};
