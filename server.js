import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateImagePrompt } from "./builder.js";
import OpenAI from "openai";
import fs from "fs-extra";
import PDFDocument from "pdfkit";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ensure "orders" folder exists
const ordersDir = "./orders";
fs.ensureDirSync(ordersDir);

/* -------------------------------
   IMAGE GENERATION ENDPOINT
-------------------------------- */
app.post("/generate", async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    const selectedModel = req.body.model || process.env.IMAGE_MODEL || "dall-e-3";

    console.log(`🖼 Using image model: ${selectedModel}`);
    console.log("Prompt:\n", prompt);

    const imageResponse = await openai.images.generate({
      model: selectedModel,
      prompt,
      size: "1024x1024",
      quality: "high"
    });

    let imageUrl;
    const imgData = imageResponse.data?.[0];
    if (imgData?.url) imageUrl = imgData.url;
    else if (imgData?.b64_json) imageUrl = `data:image/png;base64,${imgData.b64_json}`;

    if (!imageUrl) throw new Error("No image returned from API");

    res.json({ prompt, imageUrl });
  } catch (err) {
    console.error("❌ Image generation failed:", err);
    res.status(500).json({ error: "Image generation failed", details: err.message });
  }
});

/* -------------------------------
   PDF ORDER SAVE ENDPOINT
-------------------------------- */
app.post("/saveOrder", async (req, res) => {
  try {
    const { customer, table, imageUrl, prompt } = req.body;
    const orderId = `ORD-${Date.now()}`;
    const filePath = `${ordersDir}/${orderId}.pdf`;

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc.fontSize(20).fillColor("#0A1B2F").text("Bowls, Boards, & Beyond", { align: "center" });
    doc.moveDown(1);

    // Order info
    doc.fontSize(14).fillColor("#000").text(`Order #: ${orderId}`);
    doc.text(`Customer: ${customer.name}`);
    doc.text(`Address: ${customer.address}`);
    doc.text(`Phone: ${customer.phone}`);
    doc.text(`Email: ${customer.email}`);
    doc.moveDown();

    // Table details
    doc.fontSize(14).fillColor("#0A1B2F").text("Table Design Details:", { underline: true });
    Object.entries(table).forEach(([key, value]) => {
      doc.fontSize(12).fillColor("#000").text(`${key}: ${value}`);
    });

    doc.moveDown();

    // AI Prompt
    doc.fontSize(14).fillColor("#0A1B2F").text("Prompt Used:", { underline: true });
    doc.fontSize(11).fillColor("#444").text(prompt || "N/A", { align: "left" });

    // Add Image
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      const base64 = imageUrl.split(",")[1];
      const imgBuffer = Buffer.from(base64, "base64");
      const tempPath = `${ordersDir}/temp_${orderId}.png`;
      fs.writeFileSync(tempPath, imgBuffer);
      doc.addPage();
      doc.image(tempPath, { fit: [450, 450], align: "center", valign: "center" });
      fs.removeSync(tempPath);
    } else if (imageUrl) {
      doc.addPage();
      doc.fontSize(12).text("Image preview:", { align: "center" });
      doc.moveDown(1);
      doc.fillColor("blue").text(imageUrl, { link: imageUrl, underline: true, align: "center" });
    }

    doc.end();

    stream.on("finish", () => {
      console.log(`✅ Order PDF created: ${filePath}`);
      res.json({ success: true, orderId, pdfUrl: `${orderId}.pdf` });
    });
  } catch (err) {
    console.error("❌ PDF creation failed:", err);
    res.status(500).json({ error: "Failed to save order", details: err.message });
  }
});

app.use("/orders", express.static(ordersDir));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
