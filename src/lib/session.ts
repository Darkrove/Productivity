import "server-only";

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});