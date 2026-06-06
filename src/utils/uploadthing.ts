import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Eğer butonları da kullanmak istersen (UploadButton vb.) 
// @uploadthing/react paketinden şu şekilde çekilir:
export { UploadButton, UploadDropzone, Uploader } from "@uploadthing/react";