// cronjobs/weeklyBonus.js (FOR PRODUCTION - Runs weekly, prevents duplicates)
import cron from 'node-cron';
import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { WeeklyBonusTracking } from '../models/WeeklyBonusTracking.model.js';
import { generateTxnId } from '../utils/generateTxnId.js';
import mongoose from 'mongoose';

const bonusThresholds = [
    { count: 7, bonus: 6000 },
    { count: 6, bonus: 2000 },
    { count: 5, bonus: 700 },
    { count: 4, bonus: 250 },
    { count: 3, bonus: 100 },
    { count: 2, bonus: 40 },
    { count: 1, bonus: 15 }
].sort((a, b) => b.count - a.count);

export const startWeeklyBonusJob = () => {
    // CRON SCHEDULE FOR PRODUCTION: Runs every Sunday at midnight (00:00).
    // Adjust '0' (Sunday) if your week starts on a different day.
    // 0 0 * * 0 : At 00:00 on Sunday.
    cron.schedule('0 0 * * 0', async () => {
        console.log('Running Production Weekly Bonus distribution job...');

        try {
            console.log('Fetching users with role "user"...');
            const users = await User.find({ roles: 'user' }).select('_id directReferrals walletBalance');
            console.log(`Total users found: ${users.length}`);

            const userWalletUpdates = [];
            const transactionCreations = [];
            const weeklyBonusTrackingWrites = []; // This will hold all upsert/update operations for tracking

            const now = new Date();
            // Calculate the start of the current week (Sunday at 00:00:00.000)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sets to the Sunday of the current week
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setMilliseconds(0); // Ensures exact date match for consistency with unique index
            console.log(`Start of current week determined: ${startOfWeek}`);

            for (const user of users) {
                const { _id: userId, directReferrals } = user;
                const directReferralsCount = directReferrals ? directReferrals.length : 0;
                console.log(`Processing user: ${userId}, Direct Referrals: ${directReferralsCount}`);

                let bonusAmount = 0;

                for (const threshold of bonusThresholds) {
                    if (directReferralsCount >= threshold.count) {
                        bonusAmount = threshold.bonus;
                        console.log(`Bonus assigned for user ${userId}: ${bonusAmount}`);
                        break;
                    }
                }

                if (bonusAmount > 0) {
                    // Find the existing tracking record for this user and week
                    const existingTracking = await WeeklyBonusTracking.findOne({
                        userId,
                        weekStartDate: startOfWeek,
                    });
                    console.log(`For user ${userId}, existingTracking:`, existingTracking ? `Status: ${existingTracking.status}, Eligible: ${existingTracking.bonusAmountEligible}` : 'None');

                    let shouldPayoutBonus = false;

                    if (!existingTracking) {
                        // If no tracking record, create one and mark for payout
                        weeklyBonusTrackingWrites.push({
                            updateOne: {
                                filter: { userId, weekStartDate: startOfWeek },
                                update: {
                                    $set: {
                                        directReferralsCount: directReferralsCount,
                                        bonusAmountEligible: bonusAmount,
                                        status: 'paid', // Mark as paid immediately as we're processing now
                                        paidAt: now // Record the payout time
                                    }
                                },
                                upsert: true // Insert if not found
                            }
                        });
                        shouldPayoutBonus = true;
                        console.log(`New tracking record created (status 'paid') for ${userId}. Bonus will be paid.`);
                    } else if (existingTracking.status === 'pending' || existingTracking.bonusAmountEligible < bonusAmount) {
                         // If existing and pending, or eligible for higher bonus, update and mark for payout
                        weeklyBonusTrackingWrites.push({
                            updateOne: {
                                filter: { _id: existingTracking._id }, // Filter by _id for specific update
                                update: {
                                    $set: {
                                        directReferralsCount: directReferralsCount,
                                        bonusAmountEligible: bonusAmount,
                                        status: 'paid', // Mark as paid immediately
                                        paidAt: now
                                    }
                                }
                            }
                        });
                        shouldPayoutBonus = true;
                        console.log(`Existing tracking record updated (status 'paid') for ${userId}. Bonus will be paid.`);
                    } else if (existingTracking.status === 'paid') {
                        console.log(`User ${userId} already paid for this week (${startOfWeek}), or current bonus (${bonusAmount}) is not higher than eligible (${existingTracking.bonusAmountEligible}). Skipping payout.`);
                    }


                    if (shouldPayoutBonus) {
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
                                    txnId: generateTxnId('weekly_bonus'), // Ensure generateTxnId is unique
                                    amount: bonusAmount,
                                    type: 'weekly_bonus',
                                    status: 'completed',
                                    description: `Weekly bonus for ${directReferralsCount} direct referrals`
                                }
                            }
                        });
                        console.log(`User ${userId} wallet update and transaction creation queued.`);
                    } else {
                        console.log(`User ${userId} operations NOT queued for bonus payout this run.`);
                    }
                }
            }

            // Execute all bulk writes
            if (weeklyBonusTrackingWrites.length > 0) {
                const result = await WeeklyBonusTracking.bulkWrite(weeklyBonusTrackingWrites);
                console.log(`Processed WeeklyBonusTracking records: Upserted ${result.upsertedCount}, Modified ${result.modifiedCount}.`);
            }

            if (userWalletUpdates.length > 0) {
                const result = await User.bulkWrite(userWalletUpdates);
                console.log(`Updated ${result.modifiedCount} user wallets for weekly bonus.`);
            }

            if (transactionCreations.length > 0) {
                const result = await Transaction.bulkWrite(transactionCreations);
                console.log(`Inserted ${result.insertedCount} weekly bonus transactions.`);
            }

            console.log('Production Weekly Bonus distribution job completed.');

        } catch (error) {
            console.error('Error during Production Weekly Bonus distribution job:', error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
};