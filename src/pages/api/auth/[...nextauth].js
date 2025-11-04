import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

// Minimal NextAuth configuration.
// IMPORTANT: make sure to set these environment variables in .env.local before running:
// NEXTAUTH_SECRET=your-random-secret
// GOOGLE_CLIENT_ID=...
// GOOGLE_CLIENT_SECRET=...
// APPLE_CLIENT_ID=... (Service ID)
// APPLE_TEAM_ID=...
// APPLE_KEY_ID=...
// APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Apple requires more configuration (teamId, keyId, private key). You can
    // supply a prepared clientSecret string or let next-auth generate one from
    // the key material below.
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: {
        // next-auth will create a JWT for Apple using this data
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
  privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // you can customize sign in page if desired
    // signIn: '/login'
  },
});
