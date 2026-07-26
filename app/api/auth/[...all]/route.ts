import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/admin/auth/server";

export const { GET, POST } = toNextJsHandler(auth);
