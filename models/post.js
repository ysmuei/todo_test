let db;

class Post {
  static async injectDB(conn) {
    if (db) return;
    try {
      db = await conn.db("todo");
    } catch (e) {
      console.error("DB 연결 실패", e);
    }
  }

  static async getAll() {
    return await db.collection("posts").find().sort({ _id: -1 }).toArray();
  }

  static async getOne(id) {
    return await db.collection("posts").findOne({ _id: id });
  }

  static async create(postData) {
    return await db.collection("posts").insertOne(postData);
  }

  static async update(id, postData) {
    return await db
      .collection("posts")
      .updateOne({ _id: id }, { $set: postData });
  }

  static async delete(id) {
    return await db.collection("posts").deleteOne({ _id: id });
  }
}

export default Post;
