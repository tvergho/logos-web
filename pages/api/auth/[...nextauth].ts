/* eslint-disable new-cap */
import NextAuth from 'next-auth';
import DropboxProvider from 'next-auth/providers/dropbox';

export default NextAuth({
  providers: [
    DropboxProvider({
      clientId: process.env.DROPBOX_ID,
      clientSecret: process.env.DROPBOX_SECRET,
    }),
  ],
});
