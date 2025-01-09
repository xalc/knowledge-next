export interface ReadingProgressType {
  id: string;
  bookId: string;
  progress: number;
  updateTime: number;
  readingTime: number;
}
export interface CategoriesType {
  categoryId: number;

  subCategoryId: number;

  categoryType: number;

  title: string;
}
export interface BookShelfType {
  id: string;
  bookId: string;
  title: string;
  author: string;
  translator: string | null;
  cover: string;
  publishTime: Date | null;
  category: string | null;
  categories?: CategoriesType[] | null;
  lPushName: string | null;
  readUpdateTime: number | null;
  finishReading: number;
  readProgress: ReadingProgressType | null;
}
