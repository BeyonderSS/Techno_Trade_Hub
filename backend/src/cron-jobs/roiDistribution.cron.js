// cronjobs/roiDistribution.js
import cron from 'node-cron';
import { User } from '../models/User.model.js';
import { Investment } from '../models/Investment.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { generateTxnId } from '../utils/generateTxnId.js';
import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId

const levelIncomePercentages = [
  { level: 1, percent: 0.07 }, // 7%
  { level: 2, percent: 0.05 }, // 5%
  { level: 3, percent: 0.03 }, // 3%
  { level: 4, percent: 0.02 }, // 2%
  { level: 5, percent: 0.01 }, // 1%
  { level: 6, percent: 0.01 }, // 1%
  { level: 7, percent: 0.01 }  // 1%
];

export const startRoiDistributionJob = () => {
  cron.schedule('0 0 * * *', async () => { // Daily at 12 AM
    console.log('Running Optimized ROI & Level Income distribution job...');
    try {
      const investments = await Investment.find({ status: 'active', amount: { $gte: 30 } });

      const transactionOperations = [];
      const userWalletUpdates = {};

      for (const investment of investments) {
        const { userId, amount, _id: investmentId } = investment;

        let roiPercentageMin, roiPercentageMax;

        if (amount >= 30 && amount < 5000) {
          roiPercentageMin = 1;
          roiPercentageMax = 3;
        } else if (amount >= 5000 && amount < 10000) {
          roiPercentageMin = 3;
          roiPercentageMax = 5;
        } else if (amount >= 10000 && amount < 15000) {
          roiPercentageMin = 5;
          roiPercentageMax = 7;
        } else if (amount >= 15000) {
          roiPercentageMin = 7;
          roiPercentageMax = 10;
        } else {
          continue;
        }

        const dailyRoiPercentage = (Math.random() * (roiPercentageMax - roiPercentageMin) + roiPercentageMin) / 100;
        const roiAmount = amount * dailyRoiPercentage;

        await Investment.updateOne(
          { _id: investmentId },
          { $inc: { totalRoiEarned: roiAmount } }
        );

        if (userWalletUpdates[userId.toString()]) {
          userWalletUpdates[userId.toString()] += roiAmount;
        } else {
          userWalletUpdates[userId.toString()] = roiAmount;
        }

        transactionOperations.push({
          insertOne: {
            document: {
              userId,
              txnId: generateTxnId('roi_payout'),
              amount: roiAmount,
              type: 'roi_payout',
              description: `Daily ROI for investment ${investmentId}`
            }
          }
        });

        // --- Level Income Distribution ---
        let currentUplineId = userId;
        for (const levelConfig of levelIncomePercentages) {
          const { level, percent } = levelConfig;

          // Find the user who referred `currentUplineId`
          const uplineUser = await User.findOne({ directReferrals: currentUplineId }).select('_id walletBalance');

          if (!uplineUser) {
            break; // No more upline users in this chain
          }

          const levelIncomeAmount = roiAmount * percent;

          if (userWalletUpdates[uplineUser._id.toString()]) {
            userWalletUpdates[uplineUser._id.toString()] += levelIncomeAmount;
          } else {
            userWalletUpdates[uplineUser._id.toString()] = levelIncomeAmount;
          }

          transactionOperations.push({
            insertOne: {
              document: {
                userId: uplineUser._id,
                txnId: generateTxnId('level_income'),
                amount: levelIncomeAmount,
                type: 'level_income',
                description: `Level ${level} income from ROI of user ${userId}`
              }
            }
          });

          currentUplineId = uplineUser._id; // Move up to the next level
        }
      }

      const bulkUserWalletOperations = Object.entries(userWalletUpdates).map(([id, totalAmount]) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $inc: { walletBalance: totalAmount } }
        }
      }));

      if (bulkUserWalletOperations.length > 0) {
        await User.bulkWrite(bulkUserWalletOperations);
        console.log(`Updated ${bulkUserWalletOperations.length} user wallets (ROI and Level Income).`);
      }

      if (transactionOperations.length > 0) {
        await Transaction.bulkWrite(transactionOperations);
        console.log(`Inserted ${transactionOperations.length} ROI and Level Income transactions.`);
      }

      console.log('Optimized ROI & Level Income distribution job completed.');
    } catch (error) {
      console.error('Error during Optimized ROI & Level Income distribution job:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });
};