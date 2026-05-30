import { z } from 'zod';

// Schema validation cho các request cơ bản
export const stringSchema = z.string().min(1).max(1000);
export const numberSchema = z.number().int().min(0);
export const emailSchema = z.string().email();

// Schema validation cho API responses
export const apiResponseSchema = z.object({
  message: z.string().optional(),
  data: z.any().optional(),
});

// Hàm validate dữ liệu
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.issues.map((e: z.ZodIssue) => e.message).join(', ')}`);
    }
    throw error;
  }
}
