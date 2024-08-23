require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_PASS = process.env.MONGO_PASS;
const uri = `mongodb+srv://yousm:${MONGO_PASS}@cluster0.eunop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("todo");
    console.log("DB 연결 성공");
  } catch (err) {
    console.error("DB 연결 실패", err);
    process.exit(1);
  }
}

connectDB();

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/list", async (req, res) => {
  try {
    const posts = await db
      .collection("posts")
      .find()
      .sort({ _id: -1 })
      // .limit(3) // 필요시 주석 해제
      .toArray();
    res.render("list", { posts });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.post("/add", async (req, res) => {
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;
  try {
    await db
      .collection("posts")
      .insertOne({ title, dateOfGoals, dateOfCreate, todoDetail });
    res.redirect("list");
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const result = await db.collection("posts").deleteOne({ _id });
    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "삭제할 데이터가 없습니다.",
        success: false,
      });
    } else {
      res.json({ message: "성공적으로 삭제되었습니다.", success: true });
    }
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

app.get("/detail/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const post = await db.collection("posts").findOne({ _id });
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("detail", { post });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.get("/edit/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  try {
    const post = await db.collection("posts").findOne({ _id });
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("edit", { post });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
});

app.put("/edit/:id", async (req, res) => {
  const _id = new ObjectId(req.params.id);
  const { title, dateOfGoals, dateOfCreate, todoDetail } = req.body;
  try {
    const result = await db
      .collection("posts")
      .updateOne(
        { _id },
        { $set: { title, dateOfGoals, dateOfCreate, todoDetail } }
      );

    if (result.modifiedCount === 1) {
      res.json({
        success: true,
        message: "수정 완료",
        redirectUrl: `/detail/${_id.toString()}`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다.",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "서버 오류" });
  }
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

app.listen(3000, () => {
  console.log("서버 실행중...");
});
