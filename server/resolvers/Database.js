const getDb = async () => import('tw_clone_databse');

class Database {
  constructor() {
    this.uri = null;
    this.Tweet = null;
    this.User = null;
  }

  async connect(uri) {
    const db = await getDb();
    this.uri = uri;
    this.Tweet = { ...db.Tweet };
    this.User = { ...db.User };

    return db.connect(uri);
  }
}

export default Database;
