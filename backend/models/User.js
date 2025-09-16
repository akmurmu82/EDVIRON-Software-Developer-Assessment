import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false  // Do not return password field by default

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    profile: {
        firstName: { type: String, trim: true, maxlength: 50 },
        lastName: { type: String, trim: true, maxlength: 50 },
        bio: { type: String, trim: true, maxlength: 500 },
        avatarUrl: { type: String, trim: true }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});


// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    if (!this.isNew && this.isModified('password')) {
        this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password has been changed
    }

    next();
});

// Pre-save middleware to update lastLogin
userSchema.pre('save', function (next) {
    if (!this.isModified('lastLogin') && !this.isNew) {
        this.lastLogin = Date.now();
    }
    next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return verificationToken;
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
    return this.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
};

// Query helper to exclude inactive users
userSchema.query.active = function () {
    return this.where({ isActive: true });
};

const User = mongoose.model('User', userSchema);

export default User;