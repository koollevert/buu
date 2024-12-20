import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { PasswordResetToken } from '../models/password-reset-token';

const router = express.Router();

router.get('/api/users/password-reset/token/:token', async (req: Request, res: Response) => {
    const { token } = req.params;
    try {
        const passwordResetToken = await PasswordResetToken.findOne({
            token
        });

        if (!passwordResetToken) {
            return res.status(404).send('Token not found');
        }

        res.status(200).send(passwordResetToken);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/api/users/password-reset/email/:email', async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordResetToken = await PasswordResetToken.findOne({
            userId: user.id
        });

        if (!passwordResetToken) {
            return res.status(404).send('Token not found');
        }

        res.status(200).send(passwordResetToken);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export { router as passwordResetTokenRouter };