export class ThreePhaseCommit {
  protected status: 'prepare' | 'pre-commit' | null = null;

  protected id: string | null = null;

  public abort(id: string): boolean {
    if (
      (this.status === 'prepare' || this.status === 'pre-commit') &&
      this.id === id
    ) {
      this.status = null;

      this.id = null;

      return true;
    }

    return false;
  }

  public prepare(id: string): boolean {
    if (this.status === null || this.status === 'prepare') {
      this.status = 'prepare';

      return true;
    }

    return false;
  }

  public preCommit(id: string): boolean {
    if (this.status === 'prepare') {
      this.status = 'pre-commit';

      this.id = id;

      return true;
    }

    return false;
  }

  public commit(id: string): boolean {
    if (this.status === 'pre-commit' && this.id === id) {
      this.status = null;

      this.id = null;

      return true;
    }

    return false;
  }
}
