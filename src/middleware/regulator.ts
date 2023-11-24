let userRequestCount: Record<string, number> = {};

const checkFreeUserLimits = (req, res, next) => {
    const { username, isPremium } = req.user;
    if (!userRequestCount[username]) {
        userRequestCount[username] = 0;
    }
    userRequestCount[username]++;

    if (!isPremium && userRequestCount[username] > 20) {
        return res.status(429).send('You have exceeded your daily limit');
    }
    next();
};

export default checkFreeUserLimits;
