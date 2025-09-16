// models/WebhookLog.js
import mongoose from 'mongoose';
const webhookLogSchema = new mongoose.Schema({
    event_type: {
        type: String,
        required: true,
        trim: true
    },
    gateway: {
        type: String,
        required: true,
        trim: true,
        enum: ['razorpay', 'stripe', 'paypal', 'other']
    },
    payload: {
        type: mongoose.Schema.Types.Mixed, // Stores entire webhook payload
        required: true
    },
    headers: {
        type: Map,
        of: String // Stores headers as key-value pairs
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        required: true,
        enum: ['received', 'processing', 'processed', 'failed'],
        default: 'received'
    },
    response: {
        status_code: Number,
        body: mongoose.Schema.Types.Mixed,
        message: String
    },
    processing_time: {
        type: Number // in milliseconds
    },
    error: {
        message: String,
        stack: String,
        code: String
    },
    ip_address: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance and analytics
webhookLogSchema.index({ event_type: 1 });
webhookLogSchema.index({ gateway: 1 });
webhookLogSchema.index({ order_id: 1 });
webhookLogSchema.index({ status: 1 });
webhookLogSchema.index({ createdAt: 1 });
webhookLogSchema.index({ 'payload.id': 1 }); // Index for specific webhook payload fields

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);
export default WebhookLog;