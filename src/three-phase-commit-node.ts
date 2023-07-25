import { Log } from './log';
import { StateMachine } from './state-machine';
import { ThreePhaseCommit } from './three-phase-commit';
import { Transport } from './transport';

export class ThreePhaseCommitNode implements Transport {
  protected log: Log | null = null;

  protected logs: Array<Log> = [];

  protected threePhaseCommit: ThreePhaseCommit = new ThreePhaseCommit();

  constructor(protected stateMachine: StateMachine) {}

  public async abort(id: string, request: any): Promise<boolean> {
    if (!this.threePhaseCommit.abort(id)) {
      return false;
    }

    this.log = null;

    return true;
  }

  protected async apply(log: Log): Promise<any> {
    if (this.logs.length !== log.index) {
      throw new Error('TODO');
    }

    return await this.stateMachine.apply(log.data);
  }

  public async prepare(id: string, request: any): Promise<boolean> {
    if (!this.threePhaseCommit.prepare(id)) {
      return false;
    }

    return true;
  }

  public async preCommit(id: string, request: any): Promise<boolean> {
    if (!this.threePhaseCommit.preCommit(id)) {
      return false;
    }

    this.log = {
      data: request,
      id,
      index: this.logs.length,
    };

    return true;
  }

  public async commit<T>(id: string, request: any): Promise<T> {
    if (!this.threePhaseCommit.commit(id)) {
      throw new Error('TODO');
    }

    if (!this.log) {
      throw new Error('TODO');
    }

    const response = await this.apply(this.log);

    this.log = null;

    return response;
  }
}
