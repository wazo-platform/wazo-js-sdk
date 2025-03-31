export type ApiParams<SP extends Record<string, any> = Record<string, any>> =
  RecurseParams &
  PaginationParams &
  SortingParams &
  SearchParams<SP>;

export type RecurseParams = {
  recurse?: boolean;
};

export type PaginationParams = {
  offset?: number;
  limit?: number;
};

export type SortingParams = {
  order?: string;
  direction?: string
};

export type SearchParams<T extends Record<string, any> = Record<string, any>> = {
  search?: string;
} & T;

export type ListResponse<Item extends Record<string, any> = Record<string, any>> = {
  filtered: number;
  total: number;
  items: Item[];
};
