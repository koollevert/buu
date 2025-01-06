import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@selmathistckt/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/auth/password-reset/reset', [
    body('token').notEmpty().withMessage('Token must be provided'),
    body('password').trim().notEmpty().withMessage('Password must be provided')
], validateRequest, async (req: Request, res: Response) => {
    const { token, password } = req.body;

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_KEY!) as { email: string };
    } catch (err) {
        throw new BadRequestError('Invalid or expired token');
    }

    const user = await User.findOne({ email: payload.email });

    if (!user) {
        throw new BadRequestError('User not found');
    }

    user.password = await Password.toHash(password);
    await user.save();

    res.status(200).send(user);
});

export { router as resetPasswordRouter };