"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
before(function () {
    // Connect to the database before running any tests
    mongoose_1.default.connect("mongodb://localhost:27017/test-db");
});
after(function () {
    // Disconnect from the database after running all tests
    mongoose_1.default.disconnect();
});
