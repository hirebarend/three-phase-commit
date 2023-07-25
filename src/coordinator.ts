import { Transport } from './transport';

export class Coordinator {
  constructor(protected transports: Array<Transport>) {}

  public async execute<T>(id: string, request: any): Promise<Array<T | null>> {
    const responses1 = await Promise.all(
      this.transports.map((transport: Transport) =>
        transport.prepare(id, request),
      ),
    );

    const participants: Array<Transport> = this.transports.filter(
      (transport: Transport, index: number) => responses1[index],
    );

    if (participants.length < Math.floor(this.transports.length / 2 + 1)) {
      await Promise.all(
        this.transports.map((transport: Transport) =>
          transport.abort(id, request),
        ),
      );

      throw new Error(
        `expected ${Math.floor(this.transports.length / 2 + 1)}, got ${
          participants.length
        }`,
      );
    }

    const responses2 = await Promise.all(
      participants.map((transport: Transport) =>
        transport.preCommit(id, request),
      ),
    );

    if (responses2.filter((x) => x === true).length !== participants.length) {
      await Promise.all(
        participants.map((threePhaseCommitClient: Transport) =>
          threePhaseCommitClient.abort(id, request),
        ),
      );

      throw new Error('failed on pre-commit');
    }

    const responses3 = await Promise.all(
      participants.map((transport: Transport) =>
        transport.commit<T>(id, request),
      ),
    );

    if (responses3.filter((x) => x !== null).length !== participants.length) {
      await Promise.all(
        this.transports.map((transport: Transport) =>
          transport.abort(id, request),
        ),
      );

      throw new Error('failed on commit');
    }

    return responses3;
  }
}
