export interface WordData {
  id: number | string;
  word: string;
  definition_en: string;
  definition_cn: string;
  example_sentence_en: string;
  example_sentence_cn: string;
}

export interface GeneratorState {
  isLoading: boolean;
  error: string | null;
}