import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Next.js App Router için GET ve POST metodlarını dışa aktarıyoruz
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});