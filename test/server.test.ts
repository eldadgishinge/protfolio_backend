// test/server.test.js
import { expect } from "chai";

const request = require("supertest");
const app = require("../server");

describe("Server", () => {
  it("should return 'Hello Eldad API' when accessing the root", async () => {
    const response = await request(app).get("/");
    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Hello Eldad API");
  });
});

describe("Blog Endpoints", () => {
  describe("Blog Endpoints", () => {
    it("should create a new blog", async () => {
      const response = await request(app)
        .post("/Blog")
        .send({
          blog_name: "Test Blog",
          blog_image: "test_image.jpg",
          blog_description: "Test Description",
          blog_content: "Test Content",
        })
        .set("Accept", "application/json");

      expect(response.status).to.equal(200);
      expect(response.body.blog_name).to.equal("Test Blog");
      // Add more checks as needed
    });
  });
});

describe("Comment Endpoints", () => {
  // Add test cases for each comment endpoint
});

describe("Contact Endpoints", () => {
  // Add test cases for each contact endpoint
});

describe("Login Endpoints", () => {
  // Add test cases for each login endpoint
});

describe("Signup Endpoints", () => {
  // Add test cases for each signup endpoint
});
