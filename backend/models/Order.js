import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School', // Reference to School model if you have one
        required: true
    },
    trustee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trustee', // Reference to Trustee model if you have one
        required: true
    },
    student_info: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        id: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        }
    },
    gateway_name: {
        type: String,
        required: true,
        trim: true,
        enum: ['razorpay', 'stripe', 'paypal', 'other'] // Add your payment gateways
    }
}, {
    timestamps: true
});

// Indexes for better query performance
orderSchema.index({ school_id: 1 });
orderSchema.index({ trustee_id: 1 });
orderSchema.index({ 'student_info.email': 1 });
orderSchema.index({ createdAt: 1 });

const Order = mongoose.model('Order', orderSchema)

export default Order;