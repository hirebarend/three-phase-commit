export interface Transport {
  abort(id: string, request: any): Promise<boolean>;

  prepare(id: string, request: any): Promise<boolean>;

  preCommit(id: string, request: any): Promise<boolean>;

  commit<T>(id: string, request: any): Promise<T | null>;
}
