import newFrom from '../utils/new-from';

type Response = {
  number?: string;
  type: 'main' | 'associated' | 'anonymous';
};

type ListResponse = {
  items: Response[];
};

type Arguments = {
  number?: string;
  type: 'main' | 'associated' | 'anonymous';
};

export default class CallerID {
  number?: string;

  idType: 'main' | 'associated' | 'anonymous';

  type: string;

  static parse(plain: Response): CallerID {
    return new CallerID({
      number: plain.number,
      type: plain.type,
    });
  }

  static parseMany(plain: ListResponse): CallerID[] {
    return plain.items.map(item => CallerID.parse(item));
  }

  static newFrom(profile: CallerID) {
    return newFrom(profile, CallerID);
  }

  constructor({
    type,
    number,
  }: Arguments) {
    this.idType = type;
    this.number = number;
    // Useful to compare instead of instanceof with minified code
    this.type = 'CallerID';
  }

}
