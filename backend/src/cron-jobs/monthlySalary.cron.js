// cronjobs/monthlySalary.js
import cron from 'node-cron';
import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { generateTxnId } from '../utils/generateTxnId.js';
import mongoose from 'mongoose';

/**
 * Optimized helper function to get all downline users using BFS
 * @param {mongoose.ObjectId} userId
 * @returns {Promise<Set<string>>} Set of unique downline user IDs
 */
async function getAllDownlineUsersOptimized(userId) {
    const allDownline = new Set();
    const queue = [userId];

    while (queue.length > 0) {
        const currentUserId = queue.shift();

        // Find users who have currentUserId as their referredBy AND have role 'user'
        const directReferrals = await User.find({ referredBy: currentUserId, role: 'user' }).select('_id'); // ADDED ROLE FILTER

        for (const referral of directReferrals) {
            const referralIdStr = referral._id.toString();
            if (!allDownline.has(referralIdStr)) {
                allDownline.add(referralIdStr);
                queue.push(referral._id);
            }
        }
    }
    return allDownline;
}

const salaryThresholds = [
    { team: 30000, salary: 50000 },
    { team: 10000, salary: 20000 },
    { team: 5000, salary: 8000 },
    { team: 1000, salary: 4000 },
    { team: 500, salary: 2500 },
    { team: 300, salary: 800 },
    { team: 200, salary: 550 },
    { team: 100, salary: 300 },
    { team: 50, salary: 150 },
    { team: 30, salary: 90 },
    { team: 20, salary: 60 },
    { team: 10, salary: 25 },
    { team: 5, salary: 11 }
].sort((a, b) => b.team - a.team);

export const startMonthlySalaryJob = () => {
  cron.schedule('0 0 28 * *', async () => { // Every month on the 28th at 12 AM
    console.log('Running Optimized Monthly Salary distribution job...');
    try {
      // Fetch only users with role 'user'
      const users = await User.find({ roles: 'user' }).select('_id walletBalance'); // ADDED ROLE FILTER

      const userWalletUpdates = [];
      const transactionCreations = [];

      for (const user of users) {
        const { _id: userId } = user;

        // Ensure only 'user' roles are counted in the team size
        const allDownline = await getAllDownlineUsersOptimized(userId);
        const teamSize = allDownline.size;

        let salaryAmount = 0;

        for (const threshold of salaryThresholds) {
          if (teamSize >= threshold.team) {
            salaryAmount = threshold.salary;
            break;
          }
        }

        if (salaryAmount > 0) {
          userWalletUpdates.push({
            updateOne: {
              filter: { _id: userId },
              update: { $inc: { walletBalance: salaryAmount } }
            }
          });

          transactionCreations.push({
            insertOne: {
              document: {
                userId,
                txnId: generateTxnId('monthly_salary'),
                amount: salaryAmount,
                type: 'monthly_salary',
                description: `Monthly salary for team size of ${teamSize}`
              }
            }
          });
        }
      }

      if (userWalletUpdates.length > 0) {
        await User.bulkWrite(userWalletUpdates);
        console.log(`Updated ${userWalletUpdates.length} user wallets for monthly salary.`);
      }

      if (transactionCreations.length > 0) {
        await Transaction.bulkWrite(transactionCreations);
        console.log(`Inserted ${transactionCreations.length} monthly salary transactions.`);
      }

      console.log('Optimized Monthly Salary distribution job completed.');
    } catch (error) {
      console.error('Error during Optimized Monthly Salary distribution job:', error);
    }
  }, {
    timezone: "Asia/Kolkata"
  });
};