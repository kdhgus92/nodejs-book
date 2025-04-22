const { Op } = require("sequelize");
const schedule = require("node-schedule");

const { Good, Auction, User, sequelize } = require("./models");

module.exports = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간

    // finished
    const targets = await Good.findAll({
      where: {
        SoldId: null,
        createdAt: { [Op.lte]: yesterday },
      },
    });

    targets.forEach(async (target) => {
      const t = await sequelize.transaction();
      try {
        const success = await Auction.findOne({
          where: { GoodId: target.id },
          order: [["bid", "DESC"]],
          transaction: t,
        });
        await Good.update(
          { SoldId: success.UserId },
          { where: { id: target.id }, transaction: t }
        );
        await User.update(
          {
            money: sequelize.literal(`money - ${success.bid}`),
          },
          {
            where: { id: success.UserId },
            transaction: t,
          }
        );
      } catch (error) {
        t.rollback();
      }
    });

    // unsold
    const unsold = await Good.findAll({
      where: {
        SoldId: null,
        createdAt: { [Op.gt]: yesterday },
      },
    });

    unsold.forEach((target) => {
      const end = new Date(target.createdAt);
      end.setDate(end.getDate() + 1);

      schedule.scheduleJob(end, async () => {
        const t = await sequelize.transaction();
        try {
          const success = await Auction.findOne({
            where: { GoodId: target.id },
            order: [["bid", "DESC"]],
            transaction: t,
          });
          await Good.update(
            { SoldId: success.UserId },
            { where: { id: target.id }, transaction: t }
          );
          await User.update(
            {
              money: sequelize.literal(`money - ${success.bid}`),
            },
            {
              where: { id: success.UserId },
              transaction: t,
            }
          );
        } catch (error) {
          t.rollback();
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
