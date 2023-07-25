import * as hapi from '@hapi/hapi';
import { StateMachine } from './state-machine';
import { ThreePhaseCommitNode } from './three-phase-commit-node';

export class MyStateMachine implements StateMachine {
  protected value: number = 500_000;

  public async apply(command: { value: number }): Promise<any> {
    this.value += command.value;

    return {
      value: this.value,
    };
  }
}

async function startServer(port: number) {
  const threePhaseCommitNode: ThreePhaseCommitNode = new ThreePhaseCommitNode(
    new MyStateMachine(),
  );

  const server = hapi.server({
    port,
    host: '0.0.0.0',
  });

  server.route({
    method: 'POST',
    path: '/_/abort',
    handler: async (request, h) => {
      const payload: { id: string; request: any } = request.payload as any;

      return {
        success: await threePhaseCommitNode.abort(payload.id, payload.request),
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/_/prepare',
    handler: async (request, h) => {
      const payload: { id: string; request: any } = request.payload as any;

      return {
        success: await threePhaseCommitNode.prepare(
          payload.id,
          payload.request,
        ),
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/_/pre-commit',
    handler: async (request, h) => {
      const payload: { id: string; request: any } = request.payload as any;

      return {
        success: await threePhaseCommitNode.preCommit(
          payload.id,
          payload.request,
        ),
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/_/commit',
    handler: async (request, h) => {
      const payload: { id: string; request: any } = request.payload as any;

      try {
        return {
          result: await threePhaseCommitNode.commit(
            payload.id,
            payload.request,
          ),
          success: true,
        };
      } catch {
        return {
          success: false,
        };
      }
    },
  });

  await server.start();

  console.log('Server running on %s', server.info.uri);
}

startServer(process.argv[2] ? parseInt(process.argv[2]) : 8080);
