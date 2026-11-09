import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("GET /api/v1/health", () => {
  it("returns 200 and the standard success envelope", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "StayEase API is running",
      data: {
        service: "stayease-backend",
        status: "healthy",
      },
    });
  });
});

describe("unknown routes", () => {
  it("returns a 404 in the standard error envelope", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});

describe("malformed JSON bodies", () => {
  it("returns a 400 instead of a 500", async () => {
    const response = await request(app)
      .post("/api/v1/health")
      .set("Content-Type", "application/json")
      .send("{ not valid json");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});
