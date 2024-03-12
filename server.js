"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
var express = require("express");
var Joi = require("joi");
var app = express();
exports.app = app;
var cors = require("cors");
var mongoose = require("mongoose");
var Comments = require("./models/commentModels");
var Blog = require("./models/blogModeles");
var Contact = require("./models/contactModel");
var Login = require("./models/loginModeles");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
function AuthenticateToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
var swaggerJsDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
require("dotenv").config();
var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Eldad's portflio Brand for mongoDB",
            version: "1.0.0",
        },
        servers: [
            {
                url: "https://protfolio-backend-1.onrender.com/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./server.js"],
};
var swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Joi schema for blog creation
var blogSchema = Joi.object({
    blog_name: Joi.string().required(),
    blog_image: Joi.string().required(),
    blog_description: Joi.string().required(),
    blog_content: Joi.string().required(),
});
// Middleware function to validate blog creation request
var validateBlog = function (req, res, next) {
    var error = blogSchema.validate(req.body).error;
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
// comment joi validation
var commentSchema = Joi.object({
    blog_id: Joi.string().required(),
    commenter_name: Joi.string().required(),
    comment: Joi.string().required(),
});
// Define login schema
var loginSchema = Joi.object({
    user_name: Joi.string().required(),
    user_password: Joi.string().required(),
});
// Define signup schema
var signupSchema = Joi.object({
    user_name: Joi.string().required(),
    user_password: Joi.string().required(),
});
//contact us validation
var contactValidationSchema = Joi.object({
    Contact_name: Joi.string().required().messages({
        "any.required": "Please enter the contact name",
        "string.empty": "Please enter the contact name",
    }),
    contact_email: Joi.string().email().required().messages({
        "any.required": "Please enter the contact email",
        "string.empty": "Please enter the contact email",
        "string.email": "Please enter a valid email address",
    }),
    contact_message: Joi.string().required().messages({
        "any.required": "Please enter the contact message",
        "string.empty": "Please enter the contact message",
    }),
});
//routes
app.get("/", function (req, res) {
    res.send("Hello Eldad API");
});
// -----------------------------------COMMENTS-------------------------------------------------------------
/**
 * @swagger
 * /Comments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_id:
 *                 type: string
 *               commenter_name:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully created comment
 *       '400':
 *         description: Bad request. Invalid input data.
 */
// POST endpoint to create a new comment
app.post("/Comments", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, blog_id, comment, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                error = commentSchema.validate(req.body).error;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                }
                blog_id = req.body.blog_id;
                return [4 /*yield*/, Comments.create(req.body)];
            case 1:
                comment = _a.sent();
                return [4 /*yield*/, Blog.findByIdAndUpdate(blog_id, { $push: { comments: comment._id } })];
            case 2:
                _a.sent();
                res.status(200).json({ comment: comment });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Comments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all comments
 *     responses:
 *       '200':
 *         description: A list of comments
 *       '500':
 *         description: Internal server error
 */
app.get("/Comments", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Comments.find()];
            case 1:
                comments = _a.sent();
                res.status(200).json({ comments: comments });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Comments/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A comment object
 *       '500':
 *         description: Internal server error
 */
app.get("/Comments/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, comments, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Comments.findById(id)];
            case 1:
                comments = _a.sent();
                res.status(200).json(comments);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Comments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted comment
 *       '500':
 *         description: Internal server error
 */
app.delete("/Comments/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, comments, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Comments.findByIdAndDelete(id)];
            case 1:
                comments = _a.sent();
                res.status(200).json(comments);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ message: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// -----------------------------------Blogs-------------------------------------------------------------
/**
 * @swagger
 * /Blog:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_name:
 *                 type: string
 *               blog_image:
 *                 type: string
 *               blog_description:
 *                 type: string
 *               blog_content:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully created blog
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error
 */
// POST route for creating a new blog
app.post("/Blog", AuthenticateToken, validateBlog, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blog, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Blog.create(req.body)];
            case 1:
                blog = _a.sent();
                res.status(200).json({ blog: blog });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(error_5.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Blog/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A blog object
 *       '500':
 *         description: Internal server error
 */
//find blog by id
app.get("/Blog/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, blog, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Blog.findById(id).populate("comments")];
            case 1:
                blog = _a.sent();
                res.status(200).json(blog);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({ message: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Blog:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all blogs
 *     responses:
 *       '200':
 *         description: A list of blogs
 *       '500':
 *         description: Internal server error
 */
//get all blogs
app.get("/Blog", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogs, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Blog.find()];
            case 1:
                blogs = _a.sent();
                res.status(200).json({ blogs: blogs });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.log(error_7.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Blog/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_name:
 *                 type: string
 *               blog_image:
 *                 type: string
 *               blog_description:
 *                 type: string
 *               blog_content:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully updated blog
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: Blog not found
 *       '500':
 *         description: Internal server error
 */
//update blog
// Update blog by id
app.put("/Blog/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, blog, updatedblog, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, Blog.findByIdAndUpdate(id, req.body)];
            case 1:
                blog = _a.sent();
                if (!blog) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Cannot find any blog with ID ".concat(id) })];
                }
                return [4 /*yield*/, Blog.findById(id)];
            case 2:
                updatedblog = _a.sent();
                res.status(200).json(updatedblog);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.log(error_8.message);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Blog/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted blog
 *       '500':
 *         description: Internal server error
 */
//delete blog
// Delete blog route with authentication
app.delete("/Blog/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, blog, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Blog.findByIdAndDelete(id)];
            case 1:
                blog = _a.sent();
                if (!blog) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Cannot find any blog with ID ".concat(id) })];
                }
                res.status(200).json(blog);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(500).json({ message: error_9.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// -----------------------------------CONTACT -------------------------------------------------------------
/**
 * @swagger
 * /Contact:
 *   post:
 *     summary: Create a new contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Contact_name:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_message:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully created contact message
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error
 */
app.post("/Contact", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error, value, contact, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = contactValidationSchema.validate(req.body), error = _a.error, value = _a.value;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ error: error.details[0].message })];
                }
                return [4 /*yield*/, Contact.create(value)];
            case 1:
                contact = _b.sent();
                res.status(200).json({ contact: contact });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                console.log(error_10.message);
                res.status(500).json({ message: "No Contact Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Contact/{id}:
 *   put:
 *     summary: Update a contact message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Contact_name:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_message:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully updated contact message
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: Contact message not found
 *       '500':
 *         description: Internal server error
 */
// edit contact
app.put("/Contact/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, contact, updatedcontact, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, Contact.findByIdAndUpdate(id, req.body)];
            case 1:
                contact = _a.sent();
                if (!contact) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Cannot find any contact with ID ".concat(id) })];
                }
                return [4 /*yield*/, Contact.findById(id)];
            case 2:
                updatedcontact = _a.sent();
                res.status(200).json(updatedcontact);
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                console.log(error_11.message);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Contact:
 *   get:
 *     summary: Get all contact messages
 *     responses:
 *       '200':
 *         description: A list of contact messages
 *       '500':
 *         description: Internal server error
 */
// get all contacts
app.get("/Contact", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contacts, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Contact.find()];
            case 1:
                contacts = _a.sent();
                res.status(200).json({ contacts: contacts });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.log(error_12.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Contact/{id}:
 *   get:
 *     summary: Get a contact message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A contact message object
 *       '500':
 *         description: Internal server error
 */
//find contact by id
app.get("/Contact/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, contact, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Contact.findById(id)];
            case 1:
                contact = _a.sent();
                res.status(200).json(contact);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                res.status(500).json({ message: error_13.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Contact/{id}:
 *   delete:
 *     summary: Delete a contact message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted contact message
 *       '500':
 *         description: Internal server error
 */
//delete contact
app.delete("/Contact/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, contact, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Contact.findByIdAndDelete(id)];
            case 1:
                contact = _a.sent();
                res.status(200).json(contact);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                res.status(500).json({ message: error_14.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// -----------------------------------Signup and login -------------------------------------------------------------
// Sign Up Route with Joi validation
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               user_password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request. Invalid input data or user already exists.
 *       '500':
 *         description: Internal server error
 */
app.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error, value, _b, user_name, user_password, existingUser, hashedPassword, newUser, error_15;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = signupSchema.validate(req.body), error = _a.error, value = _a.value;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                }
                _b = req.body, user_name = _b.user_name, user_password = _b.user_password;
                return [4 /*yield*/, Login.findOne({ user_name: user_name })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: "User already exists" })];
                }
                return [4 /*yield*/, bcrypt.hash(user_password, 10)];
            case 2:
                hashedPassword = _c.sent();
                return [4 /*yield*/, Login.create({
                        user_name: user_name,
                        user_password: hashedPassword, // Store only the hashed password in the database
                    })];
            case 3:
                newUser = _c.sent();
                res.status(201).json({ message: "User created successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_15 = _c.sent();
                console.error(error_15);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and generate tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               user_password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Authentication successful. Access and refresh tokens generated.
 *       '400':
 *         description: Bad request. Invalid credentials.
 *       '500':
 *         description: Internal server error
 */
// Login Route with Joi validation
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error, value, _b, user_name, user_password, user, passwordMatch, accessToken, error_16;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = loginSchema.validate(req.body), error = _a.error, value = _a.value;
                if (error) {
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                }
                _b = req.body, user_name = _b.user_name, user_password = _b.user_password;
                return [4 /*yield*/, Login.findOne({ user_name: user_name }).select("+user_password")];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid credentials" })];
                }
                return [4 /*yield*/, bcrypt.compare(user_password, user.user_password)];
            case 2:
                passwordMatch = _c.sent();
                if (!passwordMatch) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid credentials" })];
                }
                accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
                // Save refresh token in the database
                return [4 /*yield*/, user.save()];
            case 3:
                // Save refresh token in the database
                _c.sent();
                res.status(200).json({ accessToken: accessToken });
                return [3 /*break*/, 5];
            case 4:
                error_16 = _c.sent();
                console.error(error_16);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Login:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all users
 *     responses:
 *       '200':
 *         description: A list of users
 *       '500':
 *         description: Internal server error
 */
//get all users
app.get("/Login", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Login.find().select("-user_password")];
            case 1:
                users = _a.sent();
                res.status(200).json({ users: users });
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.log(error_17.message);
                res.status(500).json({ message: "Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Login/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted user
 *       '500':
 *         description: Internal server error
 */
//delete user by id
app.delete("/Login/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Login.findByIdAndDelete(id)];
            case 1:
                user = _a.sent();
                res.status(200).json(user);
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                res.status(500).json({ message: error_18.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Login/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A user object
 *       '500':
 *         description: Internal server error
 */
//get user by id
app.get("/Login/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, Login.findById(id).select("-user_password")];
            case 1:
                user = _a.sent();
                res.status(200).json(user);
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                res.status(500).json({ message: error_19.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /Login/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully updated user
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
// Update user by id
app.put("/Login/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user_password, hashedPassword, user, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                user_password = req.body.user_password;
                return [4 /*yield*/, bcrypt.hash(user_password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, Login.findByIdAndUpdate(id, { user_password: hashedPassword }, { new: true } // Return the updated document
                    ).select("-user_password")];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Cannot find any user with ID ".concat(id) })];
                }
                res.status(200).json(user);
                return [3 /*break*/, 4];
            case 3:
                error_20 = _a.sent();
                console.log(error_20.message);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// --------------------------------------likes-------------------------------------------------------------
/**
 * @swagger
 * /Blog/like/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Like or Unlike a Blog Post
 *     description: Like or Unlike a blog post by providing the post ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to like or unlike.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated blog post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     tags:
 *       - Blog
 */
app.put("/Blog/like/:id", AuthenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, blog, updatedBlog_1, updatedBlog, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                userId = req.user._id;
                return [4 /*yield*/, Blog.findById(id)];
            case 1:
                blog = _a.sent();
                if (!blog.likedBy.includes(userId)) return [3 /*break*/, 3];
                return [4 /*yield*/, Blog.findByIdAndUpdate(id, {
                        $pull: { likedBy: userId },
                        $inc: { likes: -1 }, // Decrement the likes count
                    }, { new: true })];
            case 2:
                updatedBlog_1 = _a.sent();
                return [2 /*return*/, res.status(200).json(updatedBlog_1)];
            case 3: return [4 /*yield*/, Blog.findByIdAndUpdate(id, {
                    $inc: { likes: 1 },
                    $push: { likedBy: userId },
                }, { new: true })];
            case 4:
                updatedBlog = _a.sent();
                res.status(200).json(updatedBlog);
                return [3 /*break*/, 6];
            case 5:
                error_21 = _a.sent();
                console.log(error_21.message);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// -----------------------------------CONNNECTION-------------------------------------------------------------
app.listen(4000, function () {
    console.log("Server is running on port 4000");
});
mongoose
    .connect("mongodb+srv://admin:Papamama213@mybrandeldad.lzhxbzt.mongodb.net/")
    .then(function () { return console.log("Connected!"); })
    .catch(function (err) { return console.error("Connection error:", err); });
