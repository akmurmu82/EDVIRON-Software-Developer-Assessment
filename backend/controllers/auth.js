import User from '../models/User.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, passwordConfirm } = req.body;

        const user = new User.create({ username, email, password, passwordConfirm });
        // Remove password from output
        user.password = undefined;
        user.passwordConfirm = undefined;

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    const {identifier, password} = req.body; // identifier can be username or email

    try {
        const user = await User.findByEmailOrUsername(identifier);
        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update lastLogin
        user.lastLogin = Date.now();
        await user.save();

        // Remove password from output
        user.password = undefined;

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
