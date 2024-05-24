import newFrom from '../utils/new-from';
import { ExtensionRelation } from './types';

// Generic based on incall and user's incall payload
export type GenericIncall = {
  id: number;
  extensions: ExtensionRelation[];
  [key: string]: any;
};

export type IncallArguments = {
  id?: number;
  extensions?: ExtensionRelation[];
};

export default class Incall {
  id: number | undefined;

  extensions: ExtensionRelation[] | undefined;

  extension: string | undefined;

  // Useful to compare instead of instanceof with minified code
  readonly type: string = 'Incall';

  constructor({ id, extensions }: IncallArguments = {}) {
    this.id = id;
    this.extensions = extensions;
    this.extension = extensions?.[0]?.exten;
  }

  static parse(plain: GenericIncall): Incall {
    return new Incall({
      id: plain.id,
      extensions: plain.extensions,
    });
  }

  static newFrom(profile: Incall) {
    return newFrom(profile, Incall);
  }

  hasExtension(extension: string) {
    if (!this.extensions) {
      return false;
    }

    return this.extensions.some(ext => ext.exten === extension);
  }
}
