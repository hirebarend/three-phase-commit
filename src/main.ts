import axios from 'axios';
import * as uuid from 'uuid';
import { Coordinator } from './coordinator';
import { Transport } from './transport';

export class HttpTransport implements Transport {
  constructor(protected address: string) {}

  public async abort(id: string, request: any): Promise<boolean> {
    const response = await axios.post<{ success: boolean }>(
      `http://${this.address}/_/abort`,
      {
        id,
        request,
      },
    );

    return response.data.success;
  }

  public async prepare(id: string, request: any): Promise<boolean> {
    const response = await axios.post<{ success: boolean }>(
      `http://${this.address}}/_/prepare`,
      {
        id,
        request,
      },
    );

    return response.data.success;
  }

  public async preCommit(id: string, request: any): Promise<boolean> {
    const response = await axios.post<{ success: boolean }>(
      `http://${this.address}/_/pre-commit`,
      {
        id,
        request,
      },
    );

    return response.data.success;
  }

  public async commit<T>(id: string, request: any): Promise<T | null> {
    const response = await axios.post<{
      result: T;
      success: boolean;
    }>(`http://${this.address}/_/commit`, {
      id,
      request,
    });

    if (!response.data.success) {
      return null;
    }

    return response.data.result;
  }
}

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  for (const x of process.argv) {
    console.log(x);
  }

  const coordinator: Coordinator = new Coordinator([
    new HttpTransport(process.argv[2] || '127.0.0.1:8081'),
    new HttpTransport(process.argv[3] || '127.0.0.1:8082'),
    new HttpTransport(process.argv[4] || '127.0.0.1:8083'),
  ]);

  for (let i = 3; i <= 11; i++) {
    const n: number = Math.pow(3, i);

    const timestamp1 = new Date().getTime();

    for (let i = 0; i < n; i++) {
      await coordinator.execute(uuid.v4(), {
        value: -1,
      });
    }

    const timestamp2 = new Date().getTime();

    const milliseconds = timestamp2 - timestamp1;

    console.log(
      `took ${milliseconds}ms for ${n} executions (${
        (milliseconds * 1000) / n
      }ns/op)`,
    );
  }
})();
