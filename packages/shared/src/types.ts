// Common types shared between web and api

export type AIFramework = 'jest' | 'rtl' | 'pytest' | 'junit';

export interface FileRef {
  path: string;
  content?: string; // optional when listing
}

export interface TestSummary {
  id: string;
  title: string;
  rationale: string;
  targetFile: string;
  testType: 'unit' | 'integration' | 'e2e';
}

export interface GeneratedTest {
  filename: string;
  code: string;
}
