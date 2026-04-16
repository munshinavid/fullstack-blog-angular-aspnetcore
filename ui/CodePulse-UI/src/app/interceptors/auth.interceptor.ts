import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // প্রতিটি রিকোয়েস্ট ক্লোন করে withCredentials: true সেট করা
  const authRequest = req.clone({
    withCredentials: true
  });

  return next(authRequest);
};