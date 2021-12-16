class GlobalState {
  constructor() {
    this.user = {};
    this.isUserLogged = false;
  }

  getUser() {
    return this.user;
  }

  getUserIsLogged() {
    return this.isUserLogged;
  }

  setUser(user) {
    this.user = JSON.parse(JSON.stringify(user));
  }

  setIsUserLogged(logged) {
    this.isUserLogged = logged;
  }
}

export default new GlobalState();
