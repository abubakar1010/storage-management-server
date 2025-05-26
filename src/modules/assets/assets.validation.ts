import { z } from "zod";

export const assetActionValidationSchema = z.object({
    assetId: z
        .string()
        .nonempty("Asset ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid Asset ID format"),
});

export const renameAssetValidationSchema = z.object({
    assetId: z.string().nonempty("Asset ID is required"),
    newTitle: z
        .string()
        .min(1, "New title is required")
        .max(100, "Title must be under 100 characters"),
});
