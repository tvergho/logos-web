/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
import NextAuth, { User } from 'next-auth';
import DropboxProvider from 'next-auth/providers/dropbox';
import { createUser } from '../../../services/api';

type Token = {
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
  accessTokenExpires?: number | undefined;
  error?: string;
  user?: User | undefined;
}

async function refreshAccessToken(token: Token) {
  try {
    const url = 'https://api.dropboxapi.com/oauth2/token';
    const headers = new Headers();

    headers.append('Authorization', `Basic ${Buffer.from(`${process.env.DROPBOX_ID}:${process.env.DROPBOX_SECRET}`).toString('base64')}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const response = await fetch(url, {
      headers,
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }),
    });

    const json = await response.json();
    const { access_token, expires_in } = json;

    if (!response.ok) {
      console.log(json);
      throw response;
    }

    return {
      ...token,
      accessToken: access_token,
      accessTokenExpires: Date.now() + expires_in * 1000,
    };
  } catch (error: any) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    DropboxProvider({
      clientId: process.env.DROPBOX_ID,
      clientSecret: process.env.DROPBOX_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account && user) {
        token = {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
          refreshToken: account.refresh_token,
          user,
        };

        if (account.access_token && account.refresh_token) createUser(account.access_token, account.refresh_token);

        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token as Token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});
