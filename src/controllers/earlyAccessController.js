import EarlyAccess from '../models/EarlyAccess.js';

const MAX_SLOTS = 100;

export const registerEarlyAccess = async (req, res) => {
  try {
    const { name, phone, type } = req.body;

    /* ── Validation ── */
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.replace(/\s/g, '') : '';
    const normalizedType = typeof type === 'string' ? type.toLowerCase() : '';

    if (!trimmedName) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }
    if (!/^\d{10}$/.test(trimmedPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }
    if (normalizedType !== 'user' && normalizedType !== 'chef') {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    /* ── Duplicate check ── */
    const existing = await EarlyAccess.findOne({ phone: trimmedPhone });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You're already on the early access list! We'll notify you at launch 🚀",
      });
    }

    /* ── Slot limit check ── */
    const count = await EarlyAccess.countDocuments({ type: normalizedType });
    if (count >= MAX_SLOTS) {
      return res.status(403).json({
        success: false,
        message: 'All early access spots for this category are filled. Stay tuned for public launch!',
      });
    }

    /* ── Position = count + 1 ── */
    const position = count + 1;

    /* ── Insert ── */
    await EarlyAccess.create({
      name: trimmedName,
      phone: trimmedPhone,
      type: normalizedType,
    });

    /* ── Dynamic success message ── */
    const message =
      normalizedType === 'chef'
        ? `🎉 You're the ${position}th home chef onboard! Get ready to launch your kitchen with Hakkey 🚀`
        : `🎉 Congratulations! You're the ${position}th user to get early access. We'll notify you when we launch 🚀`;

    return res.status(200).json({
      success: true,
      position,
      type: normalizedType,
      message,
    });
  } catch (error) {
    // Handle Mongoose unique constraint race condition
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You're already on the early access list! We'll notify you at launch 🚀",
      });
    }
    console.error('Early access registration error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};
