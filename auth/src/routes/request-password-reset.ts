import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@selmathistckt/common';
import { User } from '../models/user';
import { sendPasswordResetEmail } from '../services/emailService';

const router = express.Router();

router.post('/api/auth/password-reset/request', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
], validateRequest, async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError('Email not found');
    }

    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_KEY!,
        { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token to user's email
    await sendPasswordResetEmail(email, token);

    res.status(200).send({ message: 'Password reset token sent' });
});

export { router as requestPasswordResetRouter };