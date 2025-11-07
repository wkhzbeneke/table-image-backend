import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateImagePrompt } from "./builder.js";
import OpenAI from "openai";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import PDFDocument from "pdfkit";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🗄️ Database setup
const openDb = async () => {
  return open({
    filename: "./orders.db",
    driver: sqlite3.Database
  });
};

const initDb = async () => {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT,
      customerName TEXT,
      customerAddress TEXT,
      customerPhone TEXT,
      customerEmail TEXT,
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
      imageUrl TEXT,
      createdAt TEXT
    )
  `);
  return db;
};

initDb();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// 🧠 Generate table image (fixed)
app.post("/generate", async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    const selectedModel = req.body.model || "dall-e-3";

    console.log(`🖼 Using model: ${selectedModel}`);
    console.log("Prompt:\n", prompt);

    // ✅ Auto-adjust model naming for new SDK compatibility
    const modelToUse =
      selectedModel === "gpt-image-1" ? "gpt-image-1" : "dall-e-3";

    const imageResponse = await openai.images.generate({
      model: modelToUse,
      prompt,
      size: "1024x1024"
    });

    // ✅ Safely extract URL regardless of API version
    const imageUrl =
      imageResponse.data?.[0]?.url ||
      imageResponse.data?.url ||
      imageResponse.url ||
      null;

    if (!imageUrl) {
      console.error("❌ No image URL returned:", imageResponse);
      return res.status(500).json({ error: "No image returned from API" });
    }

    console.log("✅ Image generated successfully:", imageUrl);
    res.json({ prompt, imageUrl });

  } catch (err) {
    console.error("❌ Image generation failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// 💾 Save order
app.post("/saveOrder", async (req, res) => {
  try {
    const db = await openDb();
    const { customer, table, prompt, imageUrl, orderId } = req.body;

    await db.run(
      `INSERT INTO orders (
        orderId, customerName, customerAddress, customerPhone, customerEmail,
        wood, shape, edge, river, length, width, diameter,
        resin1, resin2, resin3, base, finish, prompt, imageUrl, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        orderId,
        customer.name,
        customer.address,
        customer.phone,
        customer.email,
        table.wood,
        table.shape,
        table.edge,
        table.river,
        table.length,
        table.width,
        table.diameter,
        table.resin1,
        table.resin2,
        table.resin3,
        table.base,
        table.finish,
        prompt,
        imageUrl
      ]
    );

    res.json({ success: true, message: "Order saved successfully" });
  } catch (err) {
    console.error("❌ Failed to save order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 📄 Generate PDF
app.post("/generate-pdf", async (req, res) => {
  try {
    const { orderId, customer, table, prompt, imageUrl } = req.body;
    const pdfPath = `./pdfs/${orderId}.pdf`;

    if (!fs.existsSync("./pdfs")) fs.mkdirSync("./pdfs");

    const doc = new PDFDocument({ size: "LETTER", margin: 40 });
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("Bowls, Boards, & Beyond", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Order #: ${orderId}`);
    doc.moveDown();

    doc.fontSize(16).text("Customer Information", { underline: true });
    doc.fontSize(12).text(`Name: ${customer.name}`);
    doc.text(`Address: ${customer.address}`);
    doc.text(`Phone: ${customer.phone}`);
    doc.text(`Email: ${customer.email}`);
    doc.moveDown();

    doc.fontSize(16).text("Table Details", { underline: true });
    for (const [key, value] of Object.entries(table)) {
      doc.fontSize(12).text(`${key}: ${value}`);
    }

    doc.moveDown().fontSize(16).text("Prompt Used", { underline: true });
    doc.fontSize(10).text(prompt);

    if (imageUrl) {
      doc.addPage();
      doc.fontSize(16).text("Generated Table Image", { align: "center" });
      try {
        const imageResponse = await fetch(imageUrl);
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        const tempImagePath = `./pdfs/${orderId}-temp.png`;
        fs.writeFileSync(tempImagePath, buffer);
        doc.image(tempImagePath, { fit: [500, 500], align: "center" });
        fs.unlinkSync(tempImagePath);
      } catch (imgErr) {
        console.error("⚠️ Could not embed image:", imgErr);
        doc.text("[Image failed to load]");
      }
    }

    doc.end();
    res.json({
      success: true,
      message: "PDF generated successfully",
      pdfUrl: `/pdfs/${orderId}.pdf`
    });
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// 📋 View all orders
app.get("/orders", async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all("SELECT * FROM orders ORDER BY createdAt DESC");

    let html = `
      <html><head>
      <title>All Orders</title>
      <style>
        body { font-family: Arial; background:#f5f3ef; color:#333; margin:40px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 10px 14px; border-bottom: 1px solid #ccc; text-align: left; }
        th { background: #206A8A; color: white; }
        tr:hover { background: #e8f0f2; cursor: pointer; }
        h1 { color: #144f73; }
        a { color: #206A8A; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
      </head><body>
      <h1>All Saved Orders</h1>
      <table><thead><tr>
        <th>Order #</th><th>Customer</th><th>Email</th>
        <th>Wood</th><th>Shape</th><th>Base</th><th>Finish</th>
        <th>PDF</th><th>Image</th><th>Date</th>
      </tr></thead><tbody>
    `;

    for (const row of rows) {
      const pdfLink = `/pdfs/${row.orderId}.pdf`;
      html += `
        <tr>
          <td>${row.orderId}</td>
          <td>${row.customerName}</td>
          <td>${row.customerEmail}</td>
          <td>${row.wood}</td>
          <td>${row.shape}</td>
          <td>${row.base}</td>
          <td>${row.finish}</td>
          <td><a href="${pdfLink}" target="_blank">📄 View PDF</a></td>
          <td>${row.imageUrl ? `<a href="${row.imageUrl}" target="_blank">🖼 View</a>` : "—"}</td>
          <td>${new Date(row.createdAt).toLocaleString()}</td>
        </tr>`;
    }

    html += `</tbody></table></body></html>`;
    res.send(html);
  } catch (err) {
    console.error("❌ Failed to retrieve orders:", err);
    res.status(500).send("Error retrieving orders.");
  }
});

// Serve generated PDFs
app.use("/pdfs", express.static("./pdfs"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
