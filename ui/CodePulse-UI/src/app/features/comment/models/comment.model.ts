export interface User {
  id: string;
  email: string;
  // অন্যান্য প্রোপার্টি যেমন profile picture, bio ইত্যাদি এখানে যোগ করতে পারো
}

export interface Comment {
  id: string;
  content: string;
  blogPostId: string;
  userId?: string;
  dateAdded: string;
  userEmail?: string; // Optional: যদি ব্যাকএন্ড থেকে ইউজারের ইমেইল আসে, তাহলে এখানে সেট করতে পারো
}

export interface AddCommentRequest {
  content: string;
  blogPostId: string;
}

export interface UpdateCommentRequest {
  content: string;
}
