/**
 * Subscription API client
 */
import { apiRequest } from './client'

export interface Subscription {
  tier: 'free' | 'premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due'
  is_trial: boolean
  is_manually_granted: boolean
  current_period_end: string | null
  trial_ends_at: string | null
}

export interface FeatureAccess {
  feature_key: string
  is_enabled: boolean
  limit_value: number | null
  limit_period: string | null
  usage_count: number | null
  usage_limit: number | null
}

export interface UserFeatures {
  tier: string
  features: FeatureAccess[]
}

export interface QuotaSummary {
  daily_messages_limit: number
  daily_messages_used: number
  monthly_messages_limit: number
  monthly_messages_used: number
  requests_per_minute: number
  requests_per_hour: number
  features: Record<string, any>
}

/**
 * Get current user's subscription
 */
export async function getMySubscription(): Promise<Subscription> {
  return apiRequest<Subscription>('v1/subscriptions/me')
}

/**
 * Get current user's features
 */
export async function getMyFeatures(): Promise<UserFeatures> {
  return apiRequest<UserFeatures>('v1/subscriptions/me/features')
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(featureKey: string): Promise<FeatureAccess> {
  return apiRequest<FeatureAccess>(`v1/subscriptions/me/features/${featureKey}`)
}

/**
 * Get quota summary
 */
export async function getQuotaSummary(): Promise<QuotaSummary> {
  return apiRequest<QuotaSummary>('v1/subscriptions/me/quota')
}
