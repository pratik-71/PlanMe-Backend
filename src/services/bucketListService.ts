import { supabase, TABLES } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface BucketListItem {
  title: string;
  description: string;
  priority_number: number;
}

export class BucketListService {
  /**
   * Get user's bucket list (JSONB array of objects)
   */
  static async getBucketList(userId: string): Promise<BucketListItem[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('bucket_list')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new AppError(`Failed to fetch bucket list: ${error.message}`, 500);
      }

      // If no user found or bucket_list is null, return empty array
      if (!data || !data.bucket_list) {
        return [];
      }

      // Parse the JSONB data
      let bucketList: BucketListItem[] = [];
      if (typeof data.bucket_list === 'string') {
        try {
          bucketList = JSON.parse(data.bucket_list);
        } catch (parseError) {
          console.error('Error parsing bucket_list JSON:', parseError);
          return [];
        }
      } else if (Array.isArray(data.bucket_list)) {
        bucketList = data.bucket_list;
      }

      // Ensure it's an array and sort by priority_number
      if (!Array.isArray(bucketList)) {
        return [];
      }

      // Sort by priority_number (ascending order)
      return bucketList.sort((a, b) => a.priority_number - b.priority_number);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add new bucket list item (JSONB object)
   */
  static async addBucketListItem(userId: string, item: BucketListItem): Promise<BucketListItem[]> {
    try {
      // Get current bucket list
      const currentBucketList = await this.getBucketList(userId);
      
      // Find the highest priority number and add 1
      const maxPriority = currentBucketList.length > 0 
        ? Math.max(...currentBucketList.map(item => item.priority_number))
        : 0;
      
      // Create new item with next priority number
      const newItem: BucketListItem = {
        ...item,
        priority_number: maxPriority + 1,
      };
      
      // Add new item to the end of the array
      const updatedBucketList = [...currentBucketList, newItem];

      // Update the user's bucket_list field
      const { error } = await supabase
        .from(TABLES.USERS)
        .update({
          bucket_list: updatedBucketList,
        })
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Failed to add bucket list item: ${error.message}`, 500);
      }

      return updatedBucketList;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update entire bucket list (JSONB array of objects)
   */
  static async updateBucketList(userId: string, bucketList: BucketListItem[]): Promise<BucketListItem[]> {
    try {
      // Update the user's bucket_list field
      const { error } = await supabase
        .from(TABLES.USERS)
        .update({
          bucket_list: bucketList,
        })
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Failed to update bucket list: ${error.message}`, 500);
      }

      return bucketList;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reorder bucket list items based on new priority numbers
   */
  static async reorderBucketList(userId: string, reorderedItems: BucketListItem[]): Promise<BucketListItem[]> {
    try {
      // Update priority numbers based on new order
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        priority_number: index + 1,
      }));

      return await this.updateBucketList(userId, updatedItems);
    } catch (error) {
      throw error;
    }
  }
}
