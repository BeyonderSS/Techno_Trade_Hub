// cronjobs/weeklyBonus.js
import cron from 'node-cron';
import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { WeeklyBonusTracking } from '../models/WeeklyBonusTracking.model.js';
import { generateTxnId } from '../utils/generateTxnId.js';
import mongoose from 'mongoose';

const bonusThresholds = [
  { count: 2000, bonus: 6000 },
  { count: 1000, bonus: 2000 },
  { count: 500, bonus: 700 },
  { count: 200, bonus: 250 },
  { count: 100, bonus: 100 },
  { count: 50, bonus: 40 },
  { count: 25, bonus: 15 }
].sort((a, b) => b.count - a.count);

export const startWeeklyBonusJob = () => {
  cron.schedule('0 0 * * Sun', async () => { // Every Sunday at 12 AM
    console.log('Running Optimized Weekly Bonus distribution job...');
    try {
      const users = await User.find({}).select('_id directReferrals walletBalance');

      const userWalletUpdates = [];
      const transactionCreations = [];
      const weeklyBonusTrackingWrites = [];

      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      for (const user of users) {
        const { _id: userId, directReferrals } = user;
        const directReferralsCount = directReferrals ? directReferrals.length : 0;
        let bonusAmount = 0;

        for (const threshold of bonusThresholds) {
          if (directReferralsCount >= threshold.count) {
            bonusAmount = threshold.bonus;
            break;
          }
        }

        if (bonusAmount > 0) {
          let weeklyBonusTracking = await WeeklyBonusTracking.findOne({
            userId,
            weekStartDate: startOfWeek,
          });

          if (!weeklyBonusTracking) {
            weeklyBonusTrackingWrites.push({
              insertOne: {
                document: {
                  userId,
                  weekStartDate: startOfWeek,
                  directReferralsCount: directReferralsCount,
                  bonusAmountEligible: bonusAmount,
                  status: 'pending'
                }
              }
            });
          } else if (weeklyBonusTracking.status === 'pending' || weeklyBonusTracking.bonusAmountEligible < bonusAmount) {
              weeklyBonusTrackingWrites.push({
                  updateOne: {
                      filter: { _id: weeklyBonusTracking._id },
                      update: {
                          $set: {
                              directReferralsCount: directReferralsCount,
                              bonusAmountEligible: bonusAmount,
                              status: 'pending'
                          }
                      }
                  }
              });
          }

          if (!weeklyBonusTracking || weeklyBonusTracking.status === 'pending' || weeklyBonusTracking.bonusAmountEligular < bonusAmount) {
              userWalletUpdates.push({
                  updateOne: {
                      filter: { _id: userId },
                      update: { $inc: { walletBalance: bonusAmount } }
                  }
              });

              transactionCreations.push({
                  insertOne: {
                      document: {
                          userId,
                          txnId: generateTxnId('weekly_bonus'),
                          amount: bonusAmount,
                          type: 'weekly_bonus',
                          description: `Weekly bonus for ${directReferralsCount} direct referrals`
                      }
                  }
              });

              weeklyBonusTrackingWrites.push({
                  updateOne: {
                      filter: { userId, weekStartDate: startOfWeek }, // Use this filter for the final status update
                      update: { $set: { status: 'paid' } }
                  }
              });
          }
        }
      }

      if (weeklyBonusTrackingWrites.length > 0) {
          await WeeklyBonusTracking.bulkWrite(weeklyBonusTrackingWrites);
          console.log(`Processed ${weeklyBonusTrackingWrites.length} weekly bonus tracking records.`);
      }

      if (userWalletUpdates.length > 0) {
        await User.bulkWrite(userWalletUpdates);
        console.log(`Updated ${userWalletUpdates.length} user wallets for weekly bonus.`);
      }

      if (transactionCreations.length > 0) {
        await Transaction.bulkWrite(transactionCreations);
        console.log(`Inserted ${transactionCreations.length} weekly bonus transactions.`);
      }

      console.log('Optimized Weekly Bonus distribution job completed.');
    } catch (error) {
      console.error('Error during Optimized Weekly Bonus distribution job:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });
};