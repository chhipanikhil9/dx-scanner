import { injectable, inject } from 'inversify';
import { ContributorsCollector } from './ContributorsCollector';
import { BranchesCollector } from './BranchesCollector';
import { Contributor } from '../services/git/model';
import { ScanningStrategy } from '../detectors';

@injectable()
export class DataCollector {
  private readonly contributorsCollector: ContributorsCollector;
  private readonly branchesCollector: BranchesCollector;
  //TODO: add tech stack collector
  constructor(
    @inject(ContributorsCollector) contributorsCollector: ContributorsCollector,
    @inject(BranchesCollector) branchesCollector: BranchesCollector,
  ) {
    this.contributorsCollector = contributorsCollector;
    this.branchesCollector = branchesCollector;
  }
  async collectData(scanningStrategy: ScanningStrategy): Promise<CollectorsData> {
    return {
      contributors: await this.contributorsCollector.collectData(scanningStrategy),
      branches: await this.branchesCollector.collectData(scanningStrategy),
    };
  }
}

export type CollectorsData = {
  contributors: Contributor[];
  branches: {
    default: string;
    current: string;
  };
};
