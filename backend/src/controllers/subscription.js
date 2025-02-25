const User = require('../models/user');

// Upgrade user to premium subscription
exports.upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set subscription to premium and end date to 30 days from now
    user.subscription = 'premium';
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    res.json({
      message: 'Subscription upgraded successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check subscription status
exports.checkSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if premium subscription has expired
    if (user.subscription === 'premium' && user.subscriptionEndDate < new Date()) {
      user.subscription = 'free';
      user.subscriptionEndDate = null;
      await user.save();
    }

    res.json({
      subscription: user.subscription,
      subscriptionEndDate: user.subscriptionEndDate
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};