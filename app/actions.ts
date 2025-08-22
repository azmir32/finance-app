'use server'

import webpush from 'web-push'
import { db } from '../lib/db'
import { currentUser } from '@clerk/nextjs/server'

// Initialize web-push with VAPID details
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || 'azmir.aziz5197@gmail.com'}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Finance-specific notification types
export type NotificationType = 
  | 'expense-alert'
  | 'budget-reminder' 
  | 'achievement'
  | 'weekly-summary'
  | 'monthly-report'
  | 'category-suggestion'
  | 'test'

// Notification data interface
export interface NotificationData {
  title: string
  body: string
  type: NotificationType
  url?: string
  icon?: string
  badge?: string
  requireInteraction?: boolean
  silent?: boolean
  tag?: string
  renotify?: boolean
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  customData?: Record<string, unknown>
}

export async function subscribeUser(subscription: PushSubscription) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Check if user already has a subscription
    const existingSubscription = await db.pushSubscription.findFirst({
      where: { userId: user.id }
    })

    if (existingSubscription) {
      // Update existing subscription
      await db.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          endpoint: subscription.endpoint,
          p256dh: subscription.toJSON().keys?.p256dh || '',
          auth: subscription.toJSON().keys?.auth || '',
        }
      })
    } else {
      // Create new subscription
      await db.pushSubscription.create({
        data: {
          endpoint: subscription.endpoint,
          p256dh: subscription.toJSON().keys?.p256dh || '',
          auth: subscription.toJSON().keys?.auth || '',
          userId: user.id
        }
      })
    }

    console.log('User subscribed to push notifications:', user.id)
    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Error subscribing user:', error)
    return { success: false, error: 'Failed to subscribe user' }
  }
}

export async function unsubscribeUser() {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Remove subscription from database
    await db.pushSubscription.deleteMany({
      where: { userId: user.id }
    })

    console.log('User unsubscribed from push notifications:', user.id)
    return { success: true, userId: user.id }
  } catch (error) {
    console.error('Error unsubscribing user:', error)
    return { success: false, error: 'Failed to unsubscribe user' }
  }
}

export async function sendNotification(notificationData: NotificationData) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get subscription from database
    const subscription = await db.pushSubscription.findFirst({
      where: { userId: user.id }
    })

    if (!subscription) {
      throw new Error('No subscription available for user')
    }

    // Validate subscription data
    if (!subscription.endpoint || !subscription.p256dh || !subscription.auth) {
      throw new Error('Invalid subscription data')
    }

    // Create notification payload
    const payload = {
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type,
      icon: notificationData.icon || `/icons/${notificationData.type}-192x192.png`,
      badge: notificationData.badge || '/icons/badge-72x72.png',
      url: notificationData.url || '/',
      requireInteraction: notificationData.requireInteraction || false,
      silent: notificationData.silent || false,
      tag: notificationData.tag || 'expense-tracker',
      renotify: notificationData.renotify || true,
      actions: notificationData.actions || [],
      customData: notificationData.customData || {}
    }

    // Convert database subscription to web-push format
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh!,
        auth: subscription.auth!
      }
    }

    // Send notification
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    )

    console.log('Notification sent successfully:', notificationData.type)
    return { success: true, type: notificationData.type }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}

// Finance-specific notification functions
export async function sendExpenseAlert(amount: number, category: string) {
  return sendNotification({
    title: 'Expense Alert',
    body: `You spent $${amount.toFixed(2)} on ${category}`,
    type: 'expense-alert',
    url: '/expenses',
    actions: [
      { action: 'view-expense', title: 'View Details' },
      { action: 'set-budget', title: 'Set Budget' }
    ],
    customData: { amount, category }
  })
}

export async function sendBudgetReminder(percentageUsed: number) {
  return sendNotification({
    title: 'Budget Reminder',
    body: `You've used ${percentageUsed}% of your monthly budget`,
    type: 'budget-reminder',
    url: '/budget',
    requireInteraction: percentageUsed > 80,
    actions: [
      { action: 'view-expense', title: 'View Expenses' },
      { action: 'set-budget', title: 'Adjust Budget' }
    ],
    customData: { percentageUsed }
  })
}

export async function sendAchievementNotification(achievement: string) {
  return sendNotification({
    title: 'Achievement Unlocked! 🎉',
    body: achievement,
    type: 'achievement',
    url: '/achievements',
    actions: [
      { action: 'view-achievements', title: 'View Achievements' }
    ],
    customData: { achievement }
  })
}

export async function sendWeeklySummary(totalSpent: number, savings: number) {
  return sendNotification({
    title: 'Weekly Summary',
    body: `You spent $${totalSpent.toFixed(2)} this week. Savings: $${savings.toFixed(2)}`,
    type: 'weekly-summary',
    url: '/analytics',
    actions: [
      { action: 'view-analytics', title: 'View Analytics' }
    ],
    customData: { totalSpent, savings }
  })
}

export async function sendTestNotification(message: string = 'Test notification from Expense Tracker') {
  return sendNotification({
    title: 'Test Notification',
    body: message,
    type: 'test',
    url: '/',
    customData: { test: true }
  })
}