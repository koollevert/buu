import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError } from '@selmathistckt/common';

const router = express.Router();

router.get('/api/auth/verify-email', async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
        throw new BadRequestError('Token is missing');
    }

    let payload;
    try {
        payload = jwt.verify(token as string, process.env.JWT_KEY!) as { id: string, email: string };
    } catch (err) {
        throw new BadRequestError('Invalid or expired token');
    }

    const user = await User.findById(payload.id);

    if (!user) {
        throw new BadRequestError('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send({ message: 'Email verified successfully' });
});

export { router as verifyEmailRouter };