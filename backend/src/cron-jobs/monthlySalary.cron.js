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

        // FIX: Changed 'role' to 'roles' to match your schema
        const directReferrals = await User.find({ referredBy: currentUserId, roles: 'user' }).select('_id');

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
    { team: 14, salary: 50000 },
    { team: 13, salary: 20000 },
    { team: 12, salary: 8000 },
    { team: 11, salary: 4000 },
    { team: 10, salary: 2500 },
    { team: 9, salary: 800 },
    { team: 8, salary: 550 },
    { team: 7, salary: 300 },
    { team: 6, salary: 150 },
    { team: 5, salary: 90 },
    { team: 4, salary: 60 },
    { team: 3, salary: 25 },
    { team: 2, salary: 11 }
].sort((a, b) => b.team - a.team);

export const startMonthlySalaryJob = () => {
  cron.schedule('0 0 1 * *', async () => { // Runs every minute
    console.log('Running Optimized Monthly Salary distribution job...');

    try {
      console.log('Fetching users with roles "user"...'); // Updated log message
      const users = await User.find({ roles: 'user' }).select('_id walletBalance');
      console.log(`Total users found: ${users.length}`);

      const userWalletUpdates = [];
      const transactionCreations = [];

      for (const user of users) {
        const { _id: userId } = user;
        console.log(`Processing user: ${userId}`);

        console.log(`Fetching downline users for user: ${userId}`);
        const allDownline = await getAllDownlineUsersOptimized(userId);
        const teamSize = allDownline.size;
        console.log(`Team size for ${userId}: ${teamSize}`);

        let salaryAmount = 0;

        for (const threshold of salaryThresholds) {
          if (teamSize >= threshold.team) {
            salaryAmount = threshold.salary;
            console.log(`Salary assigned for user ${userId}: ${salaryAmount}`);
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
                status: 'completed',
                description: `Monthly salary for team size of ${teamSize}`
              }
            }
          });
          console.log(`User ${userId} added to wallet and transaction update queue.`);
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