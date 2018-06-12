export default class {
  constructor(url) {
    this.url = url;
  }

  getUrl() {
    return `https://${this.url}`;
  }
}
