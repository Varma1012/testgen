export interface TestCase {
  name: string;
  code: string;
}

export interface TestSummary {
  summary: string;
  tests: TestCase[];
}
