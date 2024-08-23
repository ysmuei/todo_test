import express from "express";
import * as postColtroller from "../controllers/postController.js";

const router = express.Router();

router.get("/list", postColtroller.listPosts);
router.post("/add", postColtroller.createPost);
router.delete("/delete /:id", postColtroller.deletePost);
router.get("/detail/:id", postColtroller.getPostDetails);
router.get("/edit/:id", postColtroller.getEditPost);
router.put("/edit/:id", postColtroller.updatePost);

export default router;
