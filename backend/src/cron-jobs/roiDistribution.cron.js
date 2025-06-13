// cronjobs/roiDistribution.js
import cron from 'node-cron';
import { User } from '../models/User.model.js';
import { Investment } from '../models/Investment.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { generateTxnId } from '../utils/generateTxnId.js';
import mongoose from 'mongoose';

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
    console.log('Running Dynamic Compounding ROI & Level Income distribution job...');
    try {
      // Fetch only users with role 'user' to check their wallet balances and associated investments
      const users = await User.find({ roles: 'user' }).select('_id walletBalance'); // ADDED ROLE FILTER

      const transactionOperations = [];
      const userWalletUpdates = {};
      const investmentUpdates = [];

      for (const user of users) {
        const { _id: userId, walletBalance: currentWalletBalance } = user;

        let activeInvestment = await Investment.findOne({ userId, status: 'active' });

        if (currentWalletBalance >= 30) {
          let investmentAmountForRoi = currentWalletBalance;

          let roiPercentageMin, roiPercentageMax;
          if (investmentAmountForRoi >= 30 && investmentAmountForRoi < 5000) {
            roiPercentageMin = 1;
            roiPercentageMax = 3;
          } else if (investmentAmountForRoi >= 5000 && investmentAmountForRoi < 10000) {
            roiPercentageMin = 3;
            roiPercentageMax = 5;
          } else if (investmentAmountForRoi >= 10000 && investmentAmountForRoi < 15000) {
            roiPercentageMin = 5;
            roiPercentageMax = 7;
          } else if (investmentAmountForRoi >= 15000) {
            roiPercentageMin = 7;
            roiPercentageMax = 10;
          } else {
            continue;
          }

          const dailyRoiPercentage = (Math.random() * (roiPercentageMax - roiPercentageMin) + roiPercentageMin) / 100;
          const roiAmount = investmentAmountForRoi * dailyRoiPercentage;

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
                description: `Daily ROI on wallet balance of $${currentWalletBalance.toFixed(2)}`
              }
            }
          });

          if (activeInvestment) {
            investmentUpdates.push({
              updateOne: {
                filter: { _id: activeInvestment._id },
                update: {
                  $inc: { totalRoiEarned: roiAmount },
                  $set: { amount: currentWalletBalance + roiAmount }
                }
              }
            });
          } else {
            investmentUpdates.push({
              insertOne: {
                document: {
                  userId,
                  amount: currentWalletBalance,
                  startDate: new Date(),
                  roiPercentageMin,
                  roiPercentageMax,
                  totalRoiEarned: 0,
                  status: 'active'
                }
              }
            });
          }

          // --- Level Income Distribution ---
          let currentUplineId = userId;
          for (const levelConfig of levelIncomePercentages) {
            const { level, percent } = levelConfig;

            // Find the user who referred `currentUplineId` AND has role 'user'
            const uplineUser = await User.findOne({ directReferrals: currentUplineId, role: 'user' }).select('_id'); // ADDED ROLE FILTER FOR UPLINE

            if (!uplineUser) {
              break;
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

            currentUplineId = uplineUser._id;
          }

        } else if (activeInvestment) {
          investmentUpdates.push({
            updateOne: {
              filter: { _id: activeInvestment._id },
              update: { $set: { status: 'withdrawn' } }
            }
          });
          console.log(`Investment ${activeInvestment._id} for user ${userId} marked as withdrawn due to wallet balance < $30.`);
        }
      }

      if (Object.keys(userWalletUpdates).length > 0) {
        await User.bulkWrite(Object.entries(userWalletUpdates).map(([id, totalAmount]) => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(id) },
                update: { $inc: { walletBalance: totalAmount } }
            }
        })));
        console.log(`Updated ${Object.keys(userWalletUpdates).length} user wallets (ROI and Level Income).`);
      }

      if (investmentUpdates.length > 0) {
        await Investment.bulkWrite(investmentUpdates);
        console.log(`Processed ${investmentUpdates.length} investment documents (updates/creations).`);
      }

      if (transactionOperations.length > 0) {
        await Transaction.bulkWrite(transactionOperations);
        console.log(`Inserted ${transactionOperations.length} ROI and Level Income transactions.`);
      }

      console.log('Dynamic Compounding ROI & Level Income distribution job completed.');
    } catch (error) {
      console.error('Error during Dynamic Compounding ROI & Level Income distribution job:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });
};