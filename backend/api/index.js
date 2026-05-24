// Vercel serverless entry point.
// All requests under /api/* are routed here (see ../vercel.json) and handed to
// the Express app, which contains the full /api/* router setup.
import app from '../src/server.js';
export default app;
