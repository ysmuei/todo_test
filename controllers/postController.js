import Post from "../models/post.js";
import { ObjectId } from "mongodb";

export const listPosts = async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.render("list", { posts });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

export const createPost = async (req, res) => {
  try {
    await Post.create(req.body);
    res.redirect("list");
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

export const deletePost = async (req, res) => {
  try {
    const result = await Post.delete(new ObjectId(req.params.id));
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
};

export const getPostDetails = async (req, res) => {
  try {
    const post = await Post.getOne(new ObjectId(req.params.id));
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("detail", { post });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

export const getEditPost = async (req, res) => {
  try {
    const post = await Post.getOne(new ObjectId(req.params.id));
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    res.render("edit", { post });
  } catch (err) {
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

export const updatePost = async (req, res) => {
  try {
    const result = await Post.update(new ObjectId(req.params.id), req.body);
    if (result.modifiedCount === 1) {
      res.json({
        success: true,
        message: "수정 완료",
        redirectUrl: `/detail/${req.params.id}`,
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
};
