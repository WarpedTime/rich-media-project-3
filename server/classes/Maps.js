class Map {
  constructor(hash) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
  }
}

module.exports = Map;
