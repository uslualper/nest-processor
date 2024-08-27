export interface JobInterface {
  execute(data?: any): Promise<any>;
}
