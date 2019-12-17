import ncu from 'npm-check-updates';
import { mockPackage } from '../../test/helpers/mockPackage';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { DependenciesVersionMinorPatchLevelPractice } from './DependenciesVersionMinorPatchLevel';
jest.mock('npm-check-updates');

describe('DependenciesVersionPractice of Minor and Patch Level', () => {
  let practice: DependenciesVersionMinorPatchLevelPractice;
  let containerCtx: TestContainerContext;
  const mockedNcu = <jest.Mock>ncu.run;
  const MockedJSPackageInspector = <jest.Mock<JavaScriptPackageInspector>>(<unknown>JavaScriptPackageInspector);
  let mockJsPackageInspector: JavaScriptPackageInspector;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DependenciesVersionMinorPatchLevel').to(DependenciesVersionMinorPatchLevelPractice);
    practice = containerCtx.container.get('DependenciesVersionMinorPatchLevel');
    mockJsPackageInspector = new MockedJSPackageInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('not practicing if newer package versions exists of minor or patch level', async () => {
    mockedNcu.mockImplementation(() => {
      return { 'ts-node': '^8', typescript: '^1.1.0' };
    });
    mockJsPackageInspector.packages = [mockPackage('typescript')];
    containerCtx.practiceContext.packageInspector!.packages = mockJsPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
    expect(practice.data.details).not.toBeUndefined();
  });

  it('practicing if newest package version dependency of minor or patch level', async () => {
    mockedNcu.mockImplementation(() => {
      return {};
    });
    mockJsPackageInspector.packages = [mockPackage('typescript')];
    containerCtx.practiceContext.packageInspector!.packages = mockJsPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});