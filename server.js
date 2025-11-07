import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateImagePrompt } from "./builder.js";
import OpenAI from "openai";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openDb = async () => {
  return open({
    filename: "./orders.db",
    driver: sqlite3.Database
  });
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🖼 EXISTING IMAGE GENERATOR
app.post("/generate", async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    const selectedModel = req.body.model || "dall-e-3";

    console.log(`🖼 Using image model: ${selectedModel}`);
    console.log("Prompt:\n", prompt);

    const imageResponse = await openai.images.generate({
      model: selectedModel,
      prompt,
      size: "1024x1024"
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image returned from API");

    res.json({ prompt, imageUrl });
  } catch (err) {
    console.error("❌ Image generation failed:", err);
    res.status(500).json({ error: "Image generation failed", details: err.message });
  }
});

// 💾 SAVE ORDER TO DATABASE
app.post("/saveOrder", async (req, res) => {
  const { customer, table, imageUrl, prompt } = req.body;
  try {
    const db = await openDb();
    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        name TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        wood TEXT,
        shape TEXT,
        edge TEXT,
        river TEXT,
        length TEXT,
        width TEXT,
        diameter TEXT,
        resin1 TEXT,
        resin2 TEXT,
        resin3 TEXT,
        base TEXT,
        finish TEXT,
        prompt TEXT,
        image_url TEXT,
        date_created TEXT
      )
    `);

    const orderId = "ORD-" + Date.now();
    const date = new Date().toISOString();

    await db.run(`
      INSERT INTO orders (
        order_id, name, address, phone, email, wood, shape, edge, river,
        length, width, diameter, resin1, resin2, resin3, base, finish, prompt, image_url, date_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, customer.name, customer.address, customer.phone, customer.email,
      table.wood, table.shape, table.edge, table.river, table.length,
      table.width, table.diameter, table.resin1, table.resin2, table.resin3,
      table.base, table.finish, prompt, imageUrl, date
    ]);

    res.json({ success: true, orderId });
  } catch (err) {
    console.error("❌ Database save failed:", err);
    res.status(500).json({ error: "Failed to save order", details: err.message });
  }
});

// 🧾 GENERATE ORDER PDF
app.post("/generate-pdf", async (req, res) => {
  try {
    const { orderId, customer, table, imageUrl, prompt } = req.body;

    const pdfDir = path.join(process.cwd(), "pdfs");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `${orderId}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Bowls, Boards, & Beyond", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Order #: ${orderId}`);
    doc.text(`Name: ${customer.name}`);
    doc.text(`Address: ${customer.address}`);
    doc.text(`Phone: ${customer.phone}`);
    doc.text(`Email: ${customer.email}`);
    doc.moveDown();
    doc.text(`Wood: ${table.wood}`);
    doc.text(`Shape: ${table.shape}`);
    doc.text(`Edge: ${table.edge}`);
    doc.text(`River: ${table.river}`);
    doc.text(`Length: ${table.length}`);
    doc.text(`Width: ${table.width}`);
    doc.text(`Diameter: ${table.diameter}`);
    doc.text(`Resins: ${table.resin1}, ${table.resin2}, ${table.resin3}`);
    doc.text(`Base: ${table.base}`);
    doc.text(`Finish: ${table.finish}`);
    doc.moveDown();
    doc.text("Prompt Used:");
    doc.fontSize(10).text(prompt, { width: 500 });

    if (imageUrl) {
      const img = await fetch(imageUrl);
      const buffer = Buffer.from(await img.arrayBuffer());
      const tmp = path.join(pdfDir, `tmp-${orderId}.png`);
      fs.writeFileSync(tmp, buffer);
      doc.addPage();
      doc.image(tmp, { fit: [450, 450], align: "center" });
      fs.unlinkSync(tmp);
    }

    doc.end();
    writeStream.on("finish", () => {
      res.json({ success: true, pdfUrl: `/pdfs/${orderId}.pdf` });
    });
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).json({ error: "PDF creation failed", details: err.message });
  }
});

app.use("/pdfs", express.static("pdfs"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
