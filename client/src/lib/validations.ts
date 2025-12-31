
import { z } from 'zod';

export const phoneLoginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的11位手机号"),
  code: z.string().length(6, "验证码必须是6位"),
});

export const passwordLoginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码长度至少6位"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "昵称不能为空").max(12, "昵称不能超过12个字符"),
  bio: z.string().max(50, "个性签名不能超过50个字符").optional(),
});

export const noteSchema = z.object({
  title: z.string().max(30, "标题不能超过30个字符").optional(),
  content: z.string().min(10, "感悟太短了，再多写一点吧（至少10字）").max(5000, "内容过长"),
  tags: z.array(z.string()).max(5, "最多添加5个标签").optional(),
});

export type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;
export type PasswordLoginForm = z.infer<typeof passwordLoginSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type NoteForm = z.infer<typeof noteSchema>;
