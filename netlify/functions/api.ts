import serverless from "serverless-http";
import { app } from "../../backend/dist/server.js";

// Export standard AWS Lambda / Netlify Serverless function handler
export const handler = serverless(app);
