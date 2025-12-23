export class UpdateQuestionDto {
  category?: string;
  subCatagory?: string;
  language?: 'english' | 'japan' | 'korean';
  questionENG?: string;
  questionJPN?: string;
  questionKRN?: string;
  choicesENG?: { label: string; choice: string }[];
  choicesJPN?: { label: string; choice: string }[];
  choicesKRN?: { label: string; choice: string }[];
  answers?: string[];
  image?: string;
  voice?: string;
}
