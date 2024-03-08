import mongoose from "mongoose";

before(() => {
  // Connect to the database before running any tests
  mongoose.connect("mongodb://localhost:27017/test-db");
});

after(() => {
  // Disconnect from the database after running all tests
  mongoose.disconnect();
});
