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
  // categories: string[]; // যদি ক্যাটাগরি আইডি পাঠাতে চাও
}