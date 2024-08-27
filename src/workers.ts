import { WorkerInterface } from "./common/interfaces/worker.interface";

export const workers: WorkerInterface[] = [

];

export const testWorkers: WorkerInterface[] = [
  {
    name: 'first-test',
    path: "test/first-test",
    cronTime: '* * * * *',
    data: {
      maxCount: 10,
      lockKey: 'test-lock-key',
    }
  },
  {
    name: 'first-test-2',
    path: "test/first-test",
    cronTime: '* * * * *',
    data: {
      maxCount: 10,
      lockKey: 'test-lock-key',
    }
  },
  {
    name: 'second-test',
    path: 'test/second-test',
    cronTime: '* * * * * ',
    data: {
      maxCount: 10,
      lockKey: 'test-lock-key',
    }
  },
];