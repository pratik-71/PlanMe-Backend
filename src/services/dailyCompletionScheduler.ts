import * as cron from 'node-cron';
import {DailyPlanService} from './dayPlanService';
import {UserStreakService} from './userStreakService';

/**
 * Daily Completion Scheduler
 * Runs every night at 2 AM to check if all reminders for each plan are completed
 * Updates isCompleted field and adjusts user streaks (+1 for complete, -1 for incomplete)
 */
export class DailyCompletionScheduler {
  private static cronJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler - runs at 2 AM every night
   */
  static start(): void {
    if (this.cronJob) {
      console.log('⚠️  Daily completion scheduler is already running');
      return;
    }

    // Cron expression: '0 2 * * *' = At 02:00 AM every day
    // timezone: 'UTC' ensures consistent execution time
    this.cronJob = cron.schedule(
      '0 2 * * *',
      async () => {
        console.log('🕐 Running daily completion check...');
        await this.checkAndUpdateCompletionStatus();
      },
      {
        timezone: 'UTC', // Run at 2 AM UTC consistently
      },
    );

    console.log('✅ Daily completion scheduler started (2 AM UTC)');
  }

  /**
   * Stop the scheduler
   */
  static stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('🛑 Daily completion scheduler stopped');
    }
  }

  /**
   * Manual trigger for testing
   */
  static async runNow(): Promise<void> {
    console.log('🔄 Manually triggering daily completion check...');
    await this.checkAndUpdateCompletionStatus();
  }

  /**
   * Core logic to check and update completion status
   * Optimized: Only processes yesterday's plans that need status update
   */
  private static async checkAndUpdateCompletionStatus(): Promise<void> {
    try {
      // Calculate yesterday's date in YYYY-MM-DD format
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);
      const yesterdayISO = yesterday.toISOString().slice(0, 10);

      console.log(`📅 Checking plans for: ${yesterdayISO}`);

      // OPTIMIZATION: Only get plans from yesterday that might need updates
      const allPlans = await DailyPlanService.getAllPlansForYesterday(
        yesterdayISO,
      );

      if (!allPlans || allPlans.length === 0) {
        console.log('ℹ️  No plans found for yesterday');
        return;
      }

      console.log(`📋 Processing ${allPlans.length} plans...`);

      let updatedCount = 0;
      let completedPlansCount = 0;
      let incompletePlansCount = 0;
      let skippedCount = 0;
      let streaksIncremented = 0;
      let streaksDecremented = 0;

      for (const plan of allPlans) {
        try {
          // Skip if plan has no reminders
          if (!plan.reminders) {
            skippedCount++;
            continue;
          }

          // Parse reminders safely
          let reminders = [];
          if (typeof plan.reminders === 'string') {
            try {
              reminders = JSON.parse(plan.reminders);
            } catch (e) {
              skippedCount++;
              continue;
            }
          } else if (Array.isArray(plan.reminders)) {
            reminders = plan.reminders;
          }

          // Skip if no reminders exist
          if (reminders.length === 0) {
            skippedCount++;
            continue;
          }

          // Check if ALL reminders are completed (subgoals are ignored)
          const allRemindersCompleted = reminders.every(
            (reminder: any) => reminder.completed === true,
          );

          // Determine new completion status
          const newCompletionStatus = allRemindersCompleted;

          // OPTIMIZATION: Only update if status has actually changed
          if (plan.isCompleted !== newCompletionStatus) {
            // Update plan completion status
            await DailyPlanService.updatePlanCompletionStatus(
              plan.id!,
              newCompletionStatus,
            );
            updatedCount++;

            // UPDATE USER STREAK based on completion status
            try {
              if (newCompletionStatus) {
                // All reminders completed → Increment streak
                await UserStreakService.incrementStreak(plan.user_id);
                streaksIncremented++;
              } else {
                // Some reminders incomplete → Decrement streak
                await UserStreakService.decrementStreak(plan.user_id);
                streaksDecremented++;
              }
            } catch (streakError) {
              // Continue processing other plans even if streak update fails
            }
          }

          // Track final status
          if (newCompletionStatus) {
            completedPlansCount++;
          } else {
            incompletePlansCount++;
          }
        } catch (error) {
          console.error(`Error processing plan ${plan.id}:`, error);
        }
      }

      console.log(
        `✅ Completed: ${updatedCount} plans updated, ${streaksIncremented} streaks +1, ${streaksDecremented} streaks -1`,
      );
    } catch (error) {
      console.error('Error in daily completion check:', error);
    }
  }
}

