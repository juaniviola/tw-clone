const getDb = async () => import('twclone-database');

class Database {
  constructor() {
    this.uri = null;
    this.Tweet = null;
    this.User = null;
    this.Utils = null;
  }

  async connect(uri) {
    if (this.connected) return;

    const db = await getDb();
    this.uri = uri;
    this.Tweet = { ...db.Tweet};
    this.User = { ...db.User };
    this.Utils = { ...db.utils };

    return db.connect(uri);
  }
}

export default new Database();
