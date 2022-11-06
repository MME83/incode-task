const dayjs = require('dayjs');
const { Tokens } = require('../models');

module.exports = async () => {
    const prevMonth = dayjs().subtract(1, 'month');

    await Tokens.deleteMany({ createdAt: { $lte: prevMonth } });
};
