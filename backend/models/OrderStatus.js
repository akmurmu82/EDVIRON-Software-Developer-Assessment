import mongoose from 'mongoose';
const orderStatusSchema = new mongoose.Schema({
    collect_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true // One-to-one relationship with Order
    },
    order_amount: {
        type: Number,
        required: true,
        min: 0
    },
    transaction_amount: {
        type: Number,
        required: true,
        min: 0
    },
    payment_mode: {
        type: String,
        required: true,
        trim: true,
        enum: ['card', 'netbanking', 'upi', 'wallet', 'cash']
    },
    payment_details: {
        type: String,
        trim: true
    },
    bank_reference: {
        type: String,
        trim: true
    },
    payment_message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'success', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    error_message: {
        type: String,
        trim: true
    },
    payment_time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
orderStatusSchema.index({ collect_id: 1 });
orderStatusSchema.index({ status: 1 });
orderStatusSchema.index({ payment_time: 1 });
orderStatusSchema.index({ createdAt: 1 });

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);
export default OrderStatus;