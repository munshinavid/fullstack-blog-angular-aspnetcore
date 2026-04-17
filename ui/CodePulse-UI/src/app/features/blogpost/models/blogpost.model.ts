import { Category } from "../../category/models/category.model";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateBlogPostRequest {
  title: string;
  description: string; // ব্যাকএন্ডে ShortDescription হলে এখানেও তাই দিও
  content: string;
  featuredImgUrl: string;
  urlHandle: string;
  author: string;
  publishedDate: Date;
  isVisible: boolean;
  // categories: string[]; // যদি ক্যাটাগরি আইডি পাঠাতে চাও
  categoryIds: string[]; // যদি শুধু ক্যাটাগরি আইডি পাঠাতে চাও
}

export interface UpdateBlogPostRequest {
  title: string;
  description: string; // ব্যাকএন্ডে ShortDescription হলে এখানেও তাই দিও
  content: string;
  featuredImgUrl: string;
  urlHandle: string;
  author: string;
  publishedDate: Date;
  isVisible: boolean;
  // categories: string[]; // যদি ক্যাটাগরি আইডি পাঠাতে চাও
  categoryIds: string[]; // যদি শুধু ক্যাটাগরি আইডি পাঠাতে চাও
}


export interface BlogPost {
  id: string;
  title: string;
  description: string; // ব্যাকএন্ডে ShortDescription হলে এখানেও তাই দিও
  content: string;
  featuredImgUrl: string;
  urlHandle: string;
  author: string;
  publishedDate: Date;
  isVisible: boolean;
  isDeleted: boolean; // ড্যাশবোর্ডের জন্য, যদি ব্যাকএন্ডে থাকে
  // categories: string[]; // যদি ক্যাটাগরি আইডি পাঠাতে চাও
  categories: Category[]; // যদি সম্পূর্ণ ক্যাটাগরি অবজেক্ট পাঠাতে চাও

}
