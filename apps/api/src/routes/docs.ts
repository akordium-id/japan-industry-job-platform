import { Router } from "express";
import swaggerUi from "swagger-ui-express";

export const docsRouter: Router = Router();

export const spec = {
  openapi: "3.0.0",
  info: {
    title: "JIJP API",
    version: "1.0.0",
    description: "Japan-Indonesia Job Platform API",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { 200: { description: "OK" } },
      },
    },
    "/auth/login": {
      post: { summary: "Login", responses: { 200: { description: "OK" } } },
    },
    "/auth/register": {
      post: {
        summary: "Register",
        responses: { 201: { description: "Created" } },
      },
    },
    "/jobs": {
      get: { summary: "List jobs", responses: { 200: { description: "OK" } } },
    },
    "/courses": {
      get: {
        summary: "List courses",
        responses: { 200: { description: "OK" } },
      },
    },
  },
};

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(spec));
docsRouter.get("/json", (_req, res) => res.json(spec));
