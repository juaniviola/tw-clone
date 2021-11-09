const getDb = async () => import('twclone-databse');

class Database {
  constructor() {
    this.uri = null;
    this.Tweet = null;
    this.User = null;
    this.connected = false;
  }

  async connect(uri) {
    if (this.connected) return;

    const db = await getDb();
    this.uri = uri;
    this.Tweet = { ...db.Tweet };
    this.User = { ...db.User };
    this.connected = true;

    return db.connect(uri);
  }
}

export default new Database();
