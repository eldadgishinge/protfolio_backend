const express = require("express");
const Joi = require("joi");
const app = express();
const mongoose = require("mongoose");
const Comments = require("./models/commentModels");
const Blog = require("./models/blogModeles");
const Contact = require("./models/contactModel");
const Login = require("./models/loginModeles");
const bcrypt = require("bcrypt");
app.use(express.json());
process.env.ACCESS_TOKEN_SECRET = "your-secret-key";
const verifyAccessToken = require("./auth").verifyAccessToken;
const { generateAccessToken } = require("./auth");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} = require("./auth");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",
    info:{
      title : "Eldad's portflio Brand for mongoDB",
      version: "1.0.0",
    }
    servers : [{
      url: "http://localhost:4000/",
    }]
  }
  apis: ["./server.js"],
}

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Joi schema for blog creation
const blogSchema = Joi.object({
  blog_name: Joi.string().required(),
  blog_image: Joi.string().required(),
  blog_description: Joi.string().required(),
  blog_content: Joi.string().required(),
});

// Middleware function to validate blog creation request
const validateBlog = (req, res, next) => {
  const { error } = blogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// comment joi validation

const commentSchema = Joi.object({
  blog_id: Joi.string().required(),
  commenter_name: Joi.string().required(),
  comment: Joi.string().required(),
});
// Define login schema
const loginSchema = Joi.object({
  user_name: Joi.string().required(),
  user_password: Joi.string().required(),
});

// Define signup schema
const signupSchema = Joi.object({
  user_name: Joi.string().required(),
  user_password: Joi.string().required(),
});

//contact us validation

const contactValidationSchema = Joi.object({
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

app.get("/", (req, res) => {
  res.send("Hello Eldad API");
});
// -----------------------------------COMMENTS-------------------------------------------------------------
/**
 * @swagger
 * /Comments:
 *   post:
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


app.post("/Comments", async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { blog_id } = req.body;
    const comment = await Comments.create(req.body);
    await Blog.findByIdAndUpdate(blog_id, { $push: { comments: comment._id } });
    res.status(200).json({ comment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /Comments:
 *   get:
 *     summary: Get all comments
 *     responses:
 *       '200':
 *         description: A list of comments
 *       '500':
 *         description: Internal server error
 */

app.get("/Comments", async (req, res) => {
  try {
    const comments = await Comments.find();
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});
/**
 * @swagger
 * /Comments/{id}:
 *   get:
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

app.get("/Comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comments.findById(id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /Comments/{id}:
 *   delete:
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
app.delete("/Comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comments.findByIdAndDelete(id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------Blogs-------------------------------------------------------------
/**
 * @swagger
 * /Blog:
 *   post:
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
app.post("/Blog", validateBlog, async (req, res) => {
  try {
    const blog = await Blog.create(req.body); // Use Comments.create directly
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "No blog Server Error" });
  }
});
/**
 * @swagger
 * /Blog/{id}:
 *   get:
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
app.get("/Blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("comments");
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /Blog:
 *   get:
 *     summary: Get all blogs
 *     responses:
 *       '200':
 *         description: A list of blogs
 *       '500':
 *         description: Internal server error
 */
//get all blogs
app.get("/Blog", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ blogs });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


/**
 * @swagger
 * /Blog/{id}:
 *   put:
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
app.put("/Blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body);
    if (!blog) {
      return res
        .status(404)
        .json({ message: `Cannot find any blog with ID ${id}` });
    }
    const updatedblog = await Blog.findById(id);
    res.status(200).json(updatedblog);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
/**
 * @swagger
 * /Blog/{id}:
 *   delete:
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
app.delete("/Blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
app.post("/Contact", async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // If validation passes, proceed with creating the contact
    const contact = await Contact.create(value);
    res.status(200).json({ contact });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "No Contact Server Error" });
  }
});
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
app.put("/Contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body);
    if (!contact) {
      return res
        .status(404)
        .json({ message: `Cannot find any contact with ID ${id}` });
    }
    const updatedcontact = await Contact.findById(id);
    res.status(200).json(updatedcontact);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
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
app.get("/Contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ contacts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});
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
app.get("/Contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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
app.delete("/Contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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
app.post("/signup", async (req, res) => {
  try {
    // Validate request body against signup schema
    const { error, value } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { user_name, user_password } = req.body;

    // Check if the user already exists
    const existingUser = await Login.findOne({ user_name });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Create a new user with the hashed password
    const newUser = await Login.create({
      user_name,
      user_password: hashedPassword, // Store only the hashed password in the database
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
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
app.post("/login", async (req, res) => {
  try {
    // Validate request body against login schema
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { user_name, user_password } = req.body;

    // Find the user by username and include the password field
    const user = await Login.findOne({ user_name }).select("+user_password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
/**
 * @swagger
 * /Login:
 *   get:
 *     summary: Get all users
 *     responses:
 *       '200':
 *         description: A list of users
 *       '500':
 *         description: Internal server error
 */
//get all users
app.get("/Login", async (req, res) => {
  try {
    const users = await Login.find().select("-user_password");
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});
/**
 * @swagger
 * /Login/{id}:
 *   delete:
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
app.delete("/Login/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Login.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
app.get("/Login/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Login.findById(id).select("-user_password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /Login/{id}:
 *   put:
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
app.put("/Login/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Update user document with the new hashed password
    const user = await Login.findByIdAndUpdate(
      id,
      { user_password: hashedPassword },
      { new: true } // Return the updated document
    ).select("-user_password");

    if (!user) {
      return res
        .status(404)
        .json({ message: `Cannot find any user with ID ${id}` });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --------------------------------------likes-------------------------------------------------------------

/**
 * @swagger
 * /Blog/like/{id}:
 *   put:
 *     summary: Like a blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         description: User ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       '200':
 *         description: Blog liked successfully
 *       '400':
 *         description: User has already liked this blog or invalid input data.
 *       '500':
 *         description: Internal server error
 */
app.put("/Blog/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Check if the user has already liked the blog
    const blog = await Blog.findById(id);
    if (blog.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this blog" });
    }

    // Update the like count and push the user id to likedBy array
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1 },
        $push: { likedBy: userId },
      },
      { new: true }
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -----------------------------------CONNNECTION-------------------------------------------------------------

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

mongoose
  .connect("mongodb+srv://admin:Papamama213@mybrandeldad.lzhxbzt.mongodb.net/")
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Connection error:", err));
