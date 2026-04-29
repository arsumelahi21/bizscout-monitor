import request from "supertest";
import app from "../src/app.js";

describe("GET /api/logs", () => {
  it("should return logs with pagination", async () => {
    const res = await request(app).get("/api/logs?page=1&limit=5");

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toHaveProperty("total");
    expect(res.body.meta).toHaveProperty("page");
    expect(res.body.meta).toHaveProperty("limit");
  });

  it("should handle empty logs", async () => {
    const res = await request(app).get("/api/logs?page=1&limit=5");

    expect(res.body.data).toBeDefined();
});
});