import { z } from "zod";

export const assetActionSchema = z.object({
    assetId: z
        .string()
        .nonempty("Asset ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid Asset ID format"),
});
