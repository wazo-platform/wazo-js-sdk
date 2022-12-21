import newFrom from '../utils/new-from';

type Response = {
  name: string;
  configuration: Record<string, any>;
};
type ListResponse = {
  items: Response[];
};
type Arguments = {
  name: string;
  configuration: Record<string, any>;
};
export default class ExternalApp {
  name: string;

  type: string;

  configuration: Record<string, any>;

  static parse(plain: Response): ExternalApp {
    return new ExternalApp({
      name: plain.name,
      configuration: plain.configuration,
    });
  }

  static parseMany(plain: ListResponse): ExternalApp[] {
    return plain.items.map(item => ExternalApp.parse(item));
  }

  static newFrom(profile: ExternalApp) {
    return newFrom(profile, ExternalApp);
  }

  constructor({
    name,
    configuration,
  }: Arguments = {}) {
    this.name = name;
    this.configuration = configuration;
    // Useful to compare instead of instanceof with minified code
    this.type = 'ExternalApp';
  }

}
