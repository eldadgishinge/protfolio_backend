import { app } from "../server";
import { expect } from "@jest/globals";
import supertest from "supertest";
import { jest } from "@jest/globals";

const request = supertest(app);

describe("Comment", () => {
  describe("get comment", () => {
    describe("when comment does not exists", () => {
      it("should return null", async () => {
        const comment = await app("nonexistent_id");
        expect(comment).toBeNull();
      });
    });
  });
});
describe("POST /Comments", () => {
  it("creates a new comment", async () => {
    const newComment = {
      blog_id: "6074c45ab8a3403a68abbb8d", // Sample blog ID
      text: "This is a test comment",
    };

    const response = await request(app)
      .post("/Comments")
      .send(newComment)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("comment");
    expect(response.body.comment).toHaveProperty("text", newComment.text);
  });

  it("returns 400 if validation fails", async () => {
    const invalidComment = {
      blog_id: "6074c45ab8a3403a68abbb8d", // Sample blog ID
      // Missing 'text' field
    };

    const response = await request(app)
      .post("/Comments")
      .send(invalidComment)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("handles errors gracefully", async () => {
    // Mocking the Comments.create() method to throw an error
    jest.spyOn(Comments, "create").mockImplementation(() => {
      throw new Error("Some error occurred");
    });

    const newComment = {
      blog_id: "6074c45ab8a3403a68abbb8d", // Sample blog ID
      text: "This is a test comment",
    };

    const response = await request(app)
      .post("/Comments")
      .send(newComment)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Server Error" });
  });
});
