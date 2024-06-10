import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl;
//     },
//     async session({ session, token, user }) {
//       session.user.id = token.id;
//       return session;
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
// });

export {authOptions as get, authOptions as POST};
