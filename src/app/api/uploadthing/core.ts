import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    // GIF ve büyük dosyalara izin vermek için güncellendi
    avatarUploader: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })
        .onUploadComplete(async ({ file }) => {
            console.log("Avatar yüklemesi tamamlandı:", file.url);
        }),

    bannerUploader: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })
        .onUploadComplete(async ({ file }) => {
            console.log("Banner yüklemesi tamamlandı:", file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;