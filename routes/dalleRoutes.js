import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import axios from "axios";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.send("Hello from DALL-E!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };

    const body = {
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url"
    };

    const aiResponse = await axios.post(
      "https://api.openai.com/v1/images/generations",
      body,
      config
    );

    const image_url = aiResponse.data.data[0].url;

    res.status(201).json({ photo: image_url });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(
        error?.response?.data?.error?.message || "An unknown error occurred"
      );
  }
});

export default router;
