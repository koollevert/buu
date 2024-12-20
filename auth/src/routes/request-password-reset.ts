import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@selmathistckt/common';
import crypto from 'crypto';
import { PasswordResetToken } from '../models/password-reset-token';

const router = express.Router();

router.post('/api/users/password-reset/request', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
], validateRequest, async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError('Email not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    const passwordResetToken = PasswordResetToken.build({
        token,
        userId: user.id,
        expiresAt
    });

    await passwordResetToken.save();

    // Send token to user's email (implementation not shown)
    // sendPasswordResetEmail(user.email, token);

    res.status(200).send({ message: 'Password reset token sent' });
});

export { router as requestPasswordResetRouter };