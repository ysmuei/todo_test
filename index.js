import express from "express";
import path from "path";
import postRoutes from "./routes/postRoutes.js";
import connectDB from "./config/database.js";

import post from "./models/post.js";
import { ConnectionReadyEvent } from "mongodb";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.get("/", function (req, res) {
  res.render("index");
});

app.use("/", postRoutes);

async function start() {
  const client = await connectDB();
  await post.injectDB(client);

  app.listen(port, () => {
    console.log("서버 실행중...");
  });

  process.on("SIGINT", async () => {
    try {
      await client.close();
      console.log("정상 DB 연결 종료");
      process.exit(0);
    } catch (err) {
      console.error("오류에 의한 DB 연결 종료", err);
      process.exit(1);
    }
  });
}
start();
