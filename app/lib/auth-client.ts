import { createAuthClient } from "better-auth/react";
import {
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Important: Include the same plugins you have on the server
  // so the client knows how to handle organization/2FA data
  plugins: [organizationClient(), twoFactorClient()],
});
