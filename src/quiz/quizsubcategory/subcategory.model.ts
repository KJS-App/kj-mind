export interface Subcategory {
  id?: string;
  categoryId: string;
  name: string;
  type: string; // image | text | voice | etc.
  description?: string;
}
