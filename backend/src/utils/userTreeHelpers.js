import { User } from '../models/User.model.js'; // Adjust path as per your project structure

/**
 * Optimized helper function to get all downline users (referrals and their downlines) using BFS.
 * Only includes users with role 'user'.
 * @param {mongoose.ObjectId} userId
 * @returns {Promise<Set<string>>} Set of unique downline user IDs (strings).
 */
export async function getAllDownlineUsersOptimized(userId) {
    const allDownline = new Set();
    const queue = [userId];
    const visited = new Set([userId.toString()]); // Track visited to prevent infinite loops or redundant processing

    while (queue.length > 0) {
        const currentUserId = queue.shift();

        // Find users who have currentUserId as their referredBy AND have role 'user'
        const directReferrals = await User.find({ referredBy: currentUserId, roles: 'user' }).select('_id');

        for (const referral of directReferrals) {
            const referralIdStr = referral._id.toString();
            if (!visited.has(referralIdStr)) {
                allDownline.add(referralIdStr);
                visited.add(referralIdStr);
                queue.push(referral._id);
            }
        }
    }
    return allDownline;
}

/**
 * Calculates the maximum depth of a user's downline.
 * @param {mongoose.ObjectId} userId
 * @returns {Promise<number>} The maximum depth (0 if no downline, 1 for direct referrals, etc.).
 */
export async function getMaxDownlineDepth(userId) {
    let maxDepth = 0;
    const queue = [{ id: userId, depth: 0 }]; // Start with the user itself at depth 0

    while (queue.length > 0) {
        const { id: currentUserId, depth: currentDepth } = queue.shift();

        const directReferrals = await User.find({ referredBy: currentUserId, roles: 'user' }).select('_id');

        if (directReferrals.length > 0) {
            // If current user has direct referrals, increment depth for them
            const nextDepth = currentDepth + 1;
            maxDepth = Math.max(maxDepth, nextDepth); // Update maxDepth

            for (const referral of directReferrals) {
                queue.push({ id: referral._id, depth: nextDepth });
            }
        }
    }
    return maxDepth;
}