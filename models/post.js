let db;

class Post {
  static async injectDB(conn) {
    try {
      db = conn.db("todo");
      await client.connect();
    } catch (e) {
      console.log("DB연결실패", e);
    }
  }

  static async getAll() {
    return await db
      .collection("posts")
      .find()
      .sort({ _id: -1 })
      // .limit(3) // 필요시 주석 해제
      .toArray();
  }

  static async create(postData) {
    return await db.collection("posts").insertone(postData);
  }

  static async delete(postData) {
    return await db.collection("posts").deleteone({ _id: postId });
  }

  static async getOne(postId) {
    return await db.collection("post").find({ _id: postId });
  }
  static async update(postId, postData) {
    return await db
      .collection("posts")
      .updateOne({ _id: postId }, { $set: postData });
  }
}

export default Post;
