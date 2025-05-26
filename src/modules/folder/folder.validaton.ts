import { z } from "zod";

export const createFolderValidationSchema = z.object({
    name: z.string().trim().min(1, "Folder name is required"),
    parentId: z.string().optional(),
});