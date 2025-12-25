export interface VocabularyItemDto {
  id: string;
  category: string;
  englishWord: string;
  koreanWord: string;
  japaneseWord: string;
  imageUrl: string;
  sinhalaWord: string;
  createdAt: Date;
}

export interface VocabularyItemDeleteDto {
  categoryName: string,
  itemId: string,
}
