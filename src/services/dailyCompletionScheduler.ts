import * as cron from 'node-cron';
import {DailyPlanService} from './dayPlanService';

/**
 * Daily Completion Scheduler
 * Runs every night at 2 AM to check if all reminders for each plan are completed
 * Updates isCompleted field based on reminder completion status
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
        const now = new Date();
        console.log(
          `🕐 Running daily completion check at ${now.toISOString()}...`,
        );
        await this.checkAndUpdateCompletionStatus();
      },
      {
        timezone: 'UTC', // Run at 2 AM UTC consistently
      },
    );

    const nextRun = new Date();
    nextRun.setUTCHours(2, 0, 0, 0);
    if (nextRun < new Date()) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    console.log('✅ Daily completion scheduler started');
    console.log(`⏰ Next run: ${nextRun.toISOString()} (2 AM UTC)`);
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
    const startTime = Date.now();
    try {
      // Calculate yesterday's date in YYYY-MM-DD format
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);
      const yesterdayISO = yesterday.toISOString().slice(0, 10);

      console.log(`\n📅 Checking plans for: ${yesterdayISO}`);
      console.log(`🕐 Current time: ${now.toISOString()}`);

      // OPTIMIZATION: Only get plans from yesterday that might need updates
      const allPlans = await DailyPlanService.getAllPlansForYesterday(
        yesterdayISO,
      );

      if (!allPlans || allPlans.length === 0) {
        console.log('ℹ️  No plans found for yesterday');
        console.log(`⏱️  Completed in ${Date.now() - startTime}ms\n`);
        return;
      }

      console.log(`📋 Found ${allPlans.length} plans to process`);

      let updatedCount = 0;
      let completedPlansCount = 0;
      let incompletePlansCount = 0;
      let skippedCount = 0;

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
              console.warn(
                `  ⚠️  Plan ${plan.id} has invalid reminders JSON, skipping`,
              );
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
            await DailyPlanService.updatePlanCompletionStatus(
              plan.id!,
              newCompletionStatus,
            );
            updatedCount++;

            const statusEmoji = newCompletionStatus ? '✅' : '❌';
            console.log(
              `  ✓ Plan ${plan.id} (${plan.plan_name}) → ${newCompletionStatus ? 'COMPLETED' : 'INCOMPLETE'} ${statusEmoji}`,
            );
          }

          // Track final status
          if (newCompletionStatus) {
            completedPlansCount++;
          } else {
            incompletePlansCount++;
          }
        } catch (error) {
          console.error(`  ❌ Error processing plan ${plan.id}:`, error);
        }
      }

      const duration = Date.now() - startTime;

      console.log('\n📊 Summary:');
      console.log(`  • Plans found: ${allPlans.length}`);
      console.log(`  • Plans updated: ${updatedCount}`);
      console.log(`  • Plans skipped: ${skippedCount} (no reminders)`);
      console.log(`  • Completed plans: ${completedPlansCount} ✅`);
      console.log(`  • Incomplete plans: ${incompletePlansCount} ❌`);
      console.log(`  • Duration: ${duration}ms`);
      console.log('✅ Daily completion check finished\n');
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Error in daily completion check (${duration}ms):`, error);
    }
  }
}

