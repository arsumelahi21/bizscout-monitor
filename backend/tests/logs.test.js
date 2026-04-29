import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../src/models/db.js", () => ({
  default: {
    query: jest.fn()
  }
}));


const { default: app } = await import("../src/app.js");
const { default: pool } = await import("../src/models/db.js");

describe("GET /api/logs", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return logs with pagination", async () => {

    pool.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            status: 200,
            response_time: 120,
            created_at: new Date(),
            is_anomaly: false
          }
        ]
      })
      .mockResolvedValueOnce({
        rows: [{ count: "1" }]
      });

    const res = await request(app).get("/api/logs?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("meta");
  });

  it("should handle empty logs", async () => {

    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ count: "0" }] });

    const res = await request(app).get("/api/logs?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

});