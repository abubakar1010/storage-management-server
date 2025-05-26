import { z } from "zod";

export const createFolderValidationSchema = z.object({
    name: z.string().trim().min(1, "Folder name is required"),
    parentId: z
        .string()
        .nonempty("Parent ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid Parent ID format")
        .optional(),
}).strict();