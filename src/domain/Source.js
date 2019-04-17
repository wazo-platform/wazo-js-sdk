// @flow

import type { UUID } from "./types";

export type Source = {
  backend: string,
  name: string,
  tenant_uuid: UUID,
  uuid: UUID
}

export type Sources = {
  filtered: number,
  total: number,
  items: Source[],
}
