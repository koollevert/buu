import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { User } from '../models/user';
import { Account } from '../models/user'; // Account is included in user.ts
import { BadRequestError } from '@selmathistckt/common'; // For custom error handling

const router = express.Router();

// OAuth callback endpoint
router.post('/api/auth/oauth/callback', async (req: Request, res: Response) => {
  const { code, provider } = req.body; // `code` from OAuth provider, `provider` (e.g., 'google', 'github')

  if (!code || !provider) {
    throw new BadRequestError('Code and provider are required');
  }

  if (provider === 'google') {
    throw new BadRequestError('Google provider is temporarily disabled');
  }

  try {
    // 1. Exchange the authorization code for access token
    let accessToken: string = ''; // Initialize accessToken to avoid error
    if (provider === 'google') {
      // const response = await axios.post(
      //   `https://oauth2.googleapis.com/token`,
      //   null,
      //   {
      //     params: {
      //       code,
      //       client_id: process.env.GOOGLE_CLIENT_ID,
      //       client_secret: process.env.GOOGLE_CLIENT_SECRET,
      //       redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      //       grant_type: 'authorization_code',
      //     },
      //   }
      // );
      // accessToken = response.data.access_token;
    } else if (provider === 'github') {
      const response = await axios.post(
        `https://github.com/login/oauth/access_token`,
        null,
        {
          params: {
            code,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
          },
        }
      );
      accessToken = response.data.access_token;
    } else {
      throw new BadRequestError('Unsupported provider');
    }

    // 2. Fetch user data from OAuth provider
    let userData: any;
    if (provider === 'google') {
      // const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // userData = googleResponse.data;
    } else if (provider === 'github') {
      const githubResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userData = githubResponse.data;
    }

    // 3. Check if the user exists in the database by provider account ID
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        email: userData.email,
        name: userData.name,
        image: userData.picture || userData.avatar_url, // Depending on provider
        role: 'USER',
      });
      await user.save();
    }

    // 4. Create or update the account associated with the user
    const account = await Account.findOneAndUpdate(
      { userId: user._id, provider, providerAccountId: userData.id },
      {
        userId: user._id,
        provider,
        providerAccountId: userData.id,
      },
      { upsert: true, new: true }
    );

    // 5. Issue a JWT for the authenticated user
    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY!
    );

    // 6. Set JWT in cookies or send it as a response
    res.status(200).json({ jwt: userJwt });

  } catch (error) {
    console.error('Error during OAuth callback:', error);
    throw new BadRequestError('Failed to authenticate via OAuth');
  }
});

export { router as oauthCallbackRouter };