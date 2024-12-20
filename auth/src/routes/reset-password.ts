import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PasswordResetToken } from '../models/password-reset-token';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@selmathistckt/common';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/password-reset/reset', [
    body('token')
        .notEmpty()
        .withMessage('Token must be provided'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const passwordResetToken = await PasswordResetToken.findOne({ token });

    if (!passwordResetToken) {
        throw new BadRequestError('Invalid or expired token');
    }

    const user = await User.findById(passwordResetToken.userId);

    if (!user) {
        throw new BadRequestError('User not found');
    }

    user.password = await Password.toHash(password);
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    res.status(200).send({ message: 'Password reset successful' });
});

export { router as resetPasswordRouter };