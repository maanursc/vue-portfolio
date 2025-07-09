import express from "express";
import Contact from "../models/Contact.js";
import Joi, { ValidationError } from "joi";

export const contactRouter = express.Router();

// Validation schema for contact form
const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(5).max(100).optional(),
  message: Joi.string().min(10).max(1000).required(),
});

// POST /api/contact - Submit contact form
contactRouter.post(
  "/",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Validate request body
      const { error, value } = contactValidationSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail: any) => detail.message),
        });
        return;
      }

      // Create new contact entry
      const contact = new Contact(value);
      await contact.save();

      console.log("Contact form submission saved:", contact);

      res.status(201).json({
        success: true,
        message: "Thank you for your message! I will get back to you soon.",
        data: {
          id: contact._id,
          submittedAt: contact.createdAt,
        },
      });
    } catch (error) {
      console.error("Error saving contact form:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit contact form. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? error
            : "Internal server error",
      });
    }
  }
);

// GET /api/contact - Get all contact submissions (admin only - you might want to add auth later)
contactRouter.get(
  "/",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Contact.countDocuments();

      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts",
        error:
          process.env.NODE_ENV === "development"
            ? error
            : "Internal server error",
      });
    }
  }
);
