import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

// Mock users (replace with DB-backed users in production)
const users = [
  { id: '1', name: 'Alice Landlord', email: 'alice@demo.com', password: 'password123', role: 'landlord' },
  { id: '2', name: 'Bob Renter', email: 'bob@demo.com', password: 'password123', role: 'renter' }
];

export const authOptions = {
  providers: [
    // OAuth providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: {
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    }),

    // Credentials (email/password) for demo/testing
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (user) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
