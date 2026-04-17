import EarlyAccess from '../models/EarlyAccess.js';

export const registerEarlyAccess = async (req, res) => {
  try {
    const { name, phone, type } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be exactly 10 digits' });
    }

    const existing = await EarlyAccess.findOne({ phone });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Phone already registered' });
    }

    await EarlyAccess.create({ name: name.trim(), phone, type: type || 'user' });

    return res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    console.error('Early access registration error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};
