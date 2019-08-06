import { Injectable } from '@nestjs/common';

@Injectable()
export class PipelinesService {

  public getPipelines(): string[] {
    return [
      'pipeline 1',
      'pipeline 2'
    ];
  }
}
