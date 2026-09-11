import { handle } from "hono/vercel";
import app from "./app";

/**
 * Vercel serverless entry — bundled to api/index.js by the build script so
 * Vercel never type-checks this project's TS sources as functions.
 */
export default handle(app);
