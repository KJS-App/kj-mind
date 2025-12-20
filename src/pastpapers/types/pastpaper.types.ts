import { Language, PaperType } from '../enums/paper.enums';
import { UserType } from 'src/user/enums/user.enums';

interface Discount {
    userType: UserType;
    amount: number;
}

export interface IPastPaper {
  paperId?: string;
  language: Language;
  paperType: PaperType;
  isPastPaper: boolean;
  paperURL: string;
  paperName: string;
  price: number;
  discount?: Discount;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
