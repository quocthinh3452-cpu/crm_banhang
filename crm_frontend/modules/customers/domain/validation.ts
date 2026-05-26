/**
 * Validation Schemas - Customer Form
 */

import * as z from 'zod';
import { CUSTOMER_FORM_VALIDATION } from './constants';

export const createCustomerSchema = z.object({
  name: z
    .string()
    .min(CUSTOMER_FORM_VALIDATION.NAME.MIN, 'Tên phải có ít nhất 2 ký tự')
    .max(CUSTOMER_FORM_VALIDATION.NAME.MAX, 'Tên không được quá 100 ký tự'),
  email: z
    .string()
    .email('Email không hợp lệ')
    .max(CUSTOMER_FORM_VALIDATION.EMAIL.MAX, 'Email không được quá 255 ký tự'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || CUSTOMER_FORM_VALIDATION.PHONE.PATTERN.test(val),
      'Số điện thoại không hợp lệ'
    ),
  type: z.enum(['VIP', 'Tiềm năng', 'Thường xuyên', 'Mới'] as const),
  budget: z
    .number()
    .or(z.string().transform((v) => parseFloat(v)))
    .pipe(
      z.number()
        .min(
          CUSTOMER_FORM_VALIDATION.BUDGET.MIN,
          `Ngân sách tối thiểu là ${CUSTOMER_FORM_VALIDATION.BUDGET.MIN.toLocaleString()}đ`
        )
        .max(
          CUSTOMER_FORM_VALIDATION.BUDGET.MAX,
          `Ngân sách không được vượt quá ${CUSTOMER_FORM_VALIDATION.BUDGET.MAX.toLocaleString()}đ`
        )
    ),
  notes: z.string().optional().default(''),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  id: z.string().or(z.number()),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
