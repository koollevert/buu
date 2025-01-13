import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
// import { validateRequest, BadRequestError } from '@selmathistckt/common';
import { sendVerificationEmail } from '../services/emailService';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/auth/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const user = User.build({ email, password, name });
        await user.save();

        const verificationToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).send(user);
    }
);

export { router as signupRouter };