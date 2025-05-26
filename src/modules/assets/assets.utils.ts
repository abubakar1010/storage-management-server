export const formatBytes = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const sanitizeFileName = (newName: string, oldName: string): string => {
    const sanitizedNew = newName.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const oldParts = oldName.split(".");
    const oldExtension = oldParts.length > 1 ? `.${oldParts.pop()}` : "";

    const newHasExtension = /\.[a-zA-Z0-9]+$/.test(sanitizedNew);

    return newHasExtension ? sanitizedNew : `${sanitizedNew}${oldExtension}`;
};
