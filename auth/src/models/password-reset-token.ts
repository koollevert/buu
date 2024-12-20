import mongoose from "mongoose";

// Interface describing the properties required to create a new PasswordResetToken
interface PasswordResetTokenAttrs {
    token: string;
    userId: string;
    expiresAt: Date;
}

// Interface describing the properties that a PasswordResetToken Model has
interface PasswordResetTokenModel extends mongoose.Model<PasswordResetTokenDoc> {
    build(attrs: PasswordResetTokenAttrs): PasswordResetTokenDoc;
}

// Interface describing the properties that a PasswordResetToken Document has
interface PasswordResetTokenDoc extends mongoose.Document {
    token: string;
    userId: string;
    expiresAt: Date;
}

const passwordResetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

passwordResetTokenSchema.statics.build = (attrs: PasswordResetTokenAttrs) => {
    return new PasswordResetToken(attrs);
};

const PasswordResetToken = mongoose.model<PasswordResetTokenDoc, PasswordResetTokenModel>('PasswordResetToken', passwordResetTokenSchema);

export { PasswordResetToken };