import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import type { ChatMessage, ChatRoom, Task, UserRead } from '@/data/contract';
import { getChatMessages, getChatThreads } from '@/domain/api/chatApi';
import { getCategories, searchTasks } from '@/domain/api/taskApi';
import { getCurrentUser, getUserProfile } from '@/domain/api/userApi';
import { useThemeColors } from '@/theme/useThemeColors';

type Action = {
  label: string;
  href: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost' | 'chip' | 'danger' | 'icon';
};

type RouteRow = {
  label: string;
  detail?: string;
  href?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  meta?: string;
  tone?: 'default' | 'positive' | 'warning' | 'danger';
};

type RouteSection = {
  title: string;
  body?: string;
  rows: RouteRow[];
};

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actions?: Action[];
  sections?: RouteSection[];
  testID?: string;
};

type RouteParams = {
  id?: string | string[];
  userId?: string | string[];
  category?: string | string[];
  categoryId?: string | string[];
};

type CategoryRecord = Awaited<ReturnType<typeof getCategories>>[number];

const defaultSections: Record<string, RouteSection[]> = {
  Categories: [
    {
      title: 'Popular categories',
      body: 'Start with the work people are asking for nearby.',
      rows: [
        { label: 'Cleaning', detail: 'Deep cleaning, end-of-lease, recurring visits', href: '/subcategories_list', icon: 'sparkles-outline', meta: '636' },
        { label: 'Moving', detail: 'Furniture, boxes, van help, heavy lifting', href: '/subcategories_list', icon: 'cube-outline', meta: '200' },
        { label: 'Home repairs', detail: 'Mounting, assembly, plumbing, electrical', href: '/subcategories_list', icon: 'hammer-outline', meta: '321' },
        { label: 'Tutoring', detail: 'Languages, school help, exam prep', href: '/subcategories_list', icon: 'school-outline', meta: '110' },
      ],
    },
    {
      title: 'Discovery',
      rows: [{ label: 'Search all categories', detail: 'Use search and filters to narrow work by skill, rating, price, and distance.', href: '/search_screen', icon: 'search-outline' }],
    },
  ],
  Subcategories: [
    {
      title: 'Cleaning',
      body: 'Choose a specific service area before searching or posting.',
      rows: [
        { label: 'Deep cleaning', detail: 'Kitchen, bathroom, floors, windows', href: '/search_results?q=Deep%20cleaning', icon: 'sparkles-outline', meta: '2k' },
        { label: 'Move-out cleaning', detail: 'Landlord-ready final pass', href: '/search_results?q=Move-out%20cleaning', icon: 'home-outline', meta: '400' },
        { label: 'Recurring housekeeping', detail: 'Weekly and monthly availability', href: '/search_results?q=Housekeeping', icon: 'repeat-outline', meta: '300' },
      ],
    },
  ],
  Options: [
    {
      title: 'Marketplace',
      rows: [
        { label: 'Categories', detail: 'Browse service areas and job demand.', href: '/categories_overview', icon: 'grid-outline' },
        { label: 'Saved posts', detail: 'Return to saved jobs and service profiles.', href: '/saved_posts', icon: 'heart-outline' },
        { label: 'History', detail: 'Review previous work, requests, and offers.', href: '/history_page', icon: 'time-outline' },
      ],
    },
    {
      title: 'Account',
      rows: [
        { label: 'Membership', detail: 'Plan, status, and cancellation options.', href: '/membership_status', icon: 'ribbon-outline' },
        { label: 'Account settings', detail: 'Security, privacy, data, and payments.', href: '/account_settings', icon: 'settings-outline' },
        { label: 'Invite friends', detail: 'Bring trusted people into SideHuzle.', href: '/invite_friends', icon: 'person-add-outline' },
      ],
    },
  ],
  Applicants: [
    {
      title: 'Open responses',
      rows: [
        { label: 'Maya K.', detail: 'Available tomorrow, 4.9 rating, verified ID', href: '/user_profile_external', icon: 'person-outline', meta: 'New' },
        { label: 'Jonas P.', detail: 'Sent a fixed-price offer and two questions', href: '/chat_thread', icon: 'chatbubble-ellipses-outline', meta: 'Offer' },
        { label: 'Review job post', detail: 'Edit details, hide the post, or close applications.', href: '/post_actions_sheet', icon: 'ellipsis-horizontal-circle-outline' },
      ],
    },
  ],
  'Saved posts': [
    {
      title: 'Saved nearby',
      rows: [
        { label: 'Verified handyman', detail: 'Assembly, mounting, small repairs', href: '/worker_description?id=2', icon: 'shield-checkmark-outline', meta: '4.9' },
        { label: 'Deep clean 2BR apartment', detail: 'Fixed budget, this week', href: '/job_description?id=1', icon: 'briefcase-outline', meta: '€90' },
        { label: 'Search more work', detail: 'Find new jobs and service profiles.', href: '/search_screen', icon: 'search-outline' },
      ],
    },
  ],
  History: [
    {
      title: 'Recent activity',
      rows: [
        { label: 'French tutoring request', detail: 'Completed request and messages archived', href: '/chat_thread', icon: 'checkmark-circle-outline', tone: 'positive' },
        { label: 'Painting job', detail: 'Offer declined by customer', href: '/job_description?id=1', icon: 'close-circle-outline', tone: 'warning' },
        { label: 'Add a review', detail: 'Share feedback for completed work.', href: '/add_review_form', icon: 'star-outline' },
      ],
    },
  ],
  'Posted jobs': [
    {
      title: 'Posted work',
      rows: [
        { label: 'Painting job', detail: '5 applicants, 2 new', href: '/applicants_list', icon: 'people-outline', meta: 'Open' },
        { label: 'French B2 tutor', detail: '10 offers, 2 new', href: '/applicants_list', icon: 'chatbubbles-outline', meta: 'Offers' },
        { label: 'Post Job', detail: 'Create another customer request.', href: '/help_request_form', icon: 'add-circle-outline' },
      ],
    },
  ],
  'Public profile': [
    {
      title: 'Trust signals',
      rows: [
        { label: 'Verification', detail: 'Phone, address, and ID signals', href: '/verification_pending_email', icon: 'shield-checkmark-outline', meta: '3/4' },
        { label: 'Reviews', detail: 'Customer and worker feedback', href: '/user_reviews', icon: 'star-outline', meta: '4.8' },
        { label: 'Posted jobs', detail: 'Public work history from this profile', href: '/user_posted_jobs_list', icon: 'briefcase-outline' },
      ],
    },
  ],
  'User reviews': [
    {
      title: 'Review summary',
      rows: [
        { label: 'Reliability', detail: 'Arrived on time and communicated clearly', icon: 'time-outline', meta: '4.9' },
        { label: 'Quality', detail: 'Work matched the posted scope', icon: 'star-outline', meta: '4.8' },
        { label: 'Filter reviews', detail: 'Narrow feedback by signal and rating.', href: '/review_filter', icon: 'filter-outline' },
      ],
    },
  ],
  'Followed users': [
    {
      title: 'Trusted profiles',
      rows: [
        { label: 'John Doe', detail: 'Electrical, assembly, transport', href: '/user_profile_external', icon: 'person-outline', meta: 'Following' },
        { label: 'Verified handyman', detail: 'Saved for repeat work', href: '/worker_description?id=2', icon: 'shield-checkmark-outline' },
        { label: 'Unfollow user', detail: 'Review before removing this profile.', href: '/unfollow_confirmation_modal', icon: 'person-remove-outline', tone: 'warning' },
      ],
    },
  ],
  'Account settings': [
    {
      title: 'Profile and security',
      rows: [
        { label: 'Edit profile', detail: 'Name, public bio, skills, and proof', href: '/account_info_edit', icon: 'person-outline' },
        { label: 'Change password', detail: 'Keep your login secure.', href: '/change_password_form', icon: 'lock-closed-outline' },
        { label: 'Notification settings', detail: 'Choose which updates reach you.', href: '/settings_notifications', icon: 'notifications-outline' },
      ],
    },
    {
      title: 'Payments and data',
      rows: [
        { label: 'Payment methods', detail: 'Manage cards and payout preferences.', href: '/payment_cards_manage', icon: 'card-outline' },
        { label: 'Privacy settings', detail: 'Control visibility and safety preferences.', href: '/settings_privacy', icon: 'eye-outline' },
        { label: 'Deactivate account', detail: 'Temporarily hide profile, posts, and requests.', href: '/deactivate_account', icon: 'pause-circle-outline', tone: 'danger' },
      ],
    },
  ],
  'Edit profile': [
    {
      title: 'Profile content',
      rows: [
        { label: 'Public bio', detail: 'Explain your skills, reliability, and work style.', icon: 'document-text-outline' },
        { label: 'Skills and categories', detail: 'Add keywords customers can search.', href: '/onboarding_expertise', icon: 'pricetags-outline' },
        { label: 'Gallery and documents', detail: 'Upload photos, CV, certificates, or proof.', href: '/gallery_view', icon: 'images-outline' },
      ],
    },
  ],
  'Change password': [
    {
      title: 'Security checklist',
      rows: [
        { label: 'Current password', detail: 'Required before saving a new password.', icon: 'lock-closed-outline' },
        { label: 'New password', detail: 'Use a unique password for SideHuzle.', icon: 'key-outline' },
        { label: 'Recovery', detail: 'Forgot your password?', href: '/forgot_password', icon: 'mail-outline' },
      ],
    },
  ],
  'Deactivate account': [
    {
      title: 'Before deactivation',
      rows: [
        { label: 'Temporary hidden state', detail: 'Profile, photos, posts, and requests are hidden until you log back in.', icon: 'eye-off-outline', tone: 'warning' },
        { label: 'Account data', detail: 'Request an export before you leave.', href: '/settings_data', icon: 'download-outline' },
        { label: 'Confirm deactivation', detail: 'This action should be deliberate.', icon: 'pause-circle-outline', tone: 'danger' },
      ],
    },
  ],
  'Payment cards': [
    {
      title: 'Saved methods',
      rows: [
        { label: 'No payment methods yet', detail: 'Add a card before booking paid work.', href: '/payment_card_add', icon: 'card-outline', tone: 'warning' },
        { label: 'Select payment', detail: 'Choose a method for the next booking.', href: '/payment_method_select', icon: 'wallet-outline' },
      ],
    },
  ],
  'Manage payments': [
    {
      title: 'Payment methods',
      rows: [
        { label: 'Add card', detail: 'Card holder, number, expiry, and CVV.', href: '/payment_card_add', icon: 'add-circle-outline' },
        { label: 'Payment cards', detail: 'Review saved methods.', href: '/payment_cards_list', icon: 'card-outline' },
        { label: 'No methods state', detail: 'Empty payment setup path.', href: '/payment_methods_empty', icon: 'alert-circle-outline', tone: 'warning' },
      ],
    },
  ],
  'Add card': [
    {
      title: 'Card details',
      rows: [
        { label: 'Card holder', detail: 'Name as printed on the card.', icon: 'person-outline' },
        { label: 'Card number', detail: 'Encrypted before it is sent to the payment provider.', icon: 'card-outline' },
        { label: 'Expiry and CVV', detail: 'Required to verify the card.', icon: 'calendar-outline' },
      ],
    },
  ],
  'Select payment': [
    {
      title: 'Choose payment method',
      rows: [
        { label: 'Card', detail: 'Use a saved card for this booking.', icon: 'card-outline' },
        { label: 'Apple Pay', detail: 'Fast checkout where supported.', icon: 'logo-apple' },
        { label: 'Google Pay', detail: 'Fast checkout where supported.', icon: 'logo-google' },
      ],
    },
  ],
  'No payment methods': [
    {
      title: 'Payment setup',
      rows: [{ label: 'Add card', detail: 'Add a payment method before booking work.', href: '/payment_card_add', icon: 'add-circle-outline' }],
    },
  ],
  'Membership plans': [
    {
      title: 'Plans',
      rows: [
        { label: 'Free', detail: 'Browse, save, and start basic marketplace activity.', icon: 'leaf-outline' },
        { label: 'Plus', detail: 'More visibility, faster matching, and saved filters.', icon: 'ribbon-outline', meta: 'Popular' },
        { label: 'Professional', detail: 'Profile boost and stronger service analytics.', icon: 'business-outline' },
      ],
    },
  ],
  'Membership status': [
    {
      title: 'Current plan',
      rows: [
        { label: 'Free plan', detail: 'Active now.', icon: 'checkmark-circle-outline', tone: 'positive' },
        { label: 'Compare plans', detail: 'See upgrade options.', href: '/membership_plans', icon: 'ribbon-outline' },
        { label: 'Cancel membership', detail: 'Review membership changes.', href: '/membership_cancel_confirm', icon: 'close-circle-outline', tone: 'warning' },
      ],
    },
  ],
  'Cancel membership': [
    {
      title: 'Cancellation review',
      rows: [
        { label: 'Benefits affected', detail: 'Profile boosts and priority matching stop at renewal.', icon: 'alert-circle-outline', tone: 'warning' },
        { label: 'Keep free access', detail: 'Saved work, messages, and account remain available.', icon: 'checkmark-circle-outline', tone: 'positive' },
      ],
    },
  ],
  'Report reason': [
    {
      title: 'Safety categories',
      rows: [
        { label: 'Spam or scam', detail: 'Suspicious messages, payment pressure, fake listing.', href: '/report_message_input', icon: 'warning-outline' },
        { label: 'Unsafe behavior', detail: 'Threats, harassment, or identity concerns.', href: '/report_message_input', icon: 'shield-outline' },
        { label: 'Wrong category', detail: 'Misleading listing or prohibited work.', href: '/report_message_input', icon: 'flag-outline' },
      ],
    },
  ],
  'Report details': [
    {
      title: 'Add context',
      rows: [
        { label: 'What happened?', detail: 'Describe the issue clearly for support.', icon: 'document-text-outline' },
        { label: 'Evidence', detail: 'Messages, photos, or listing context help review.', icon: 'attach-outline' },
        { label: 'Submit report', detail: 'Trust and safety reviews the case.', href: '/report_confirmation', icon: 'send-outline' },
      ],
    },
  ],
  'Report sent': [
    {
      title: 'Next steps',
      rows: [
        { label: 'Support review', detail: 'The report is queued for trust and safety.', icon: 'shield-checkmark-outline', tone: 'positive' },
        { label: 'Back to marketplace', detail: 'Continue browsing work.', href: '/(tabs)/landing_page', icon: 'map-outline' },
      ],
    },
  ],
  'Add review': [
    {
      title: 'Review signals',
      rows: [
        { label: 'Rating', detail: 'Score the completed work fairly.', icon: 'star-outline' },
        { label: 'Written feedback', detail: 'Mention communication, quality, and reliability.', icon: 'create-outline' },
        { label: 'Skip feedback', detail: 'Decline this review request.', href: '/decline_rating', icon: 'close-circle-outline' },
      ],
    },
  ],
  'Review filters': [
    {
      title: 'Filter reviews',
      rows: [
        { label: 'Rating', detail: 'Minimum score and recent reviews.', icon: 'star-outline' },
        { label: 'Job type', detail: 'Jobs, services, recurring work.', icon: 'briefcase-outline' },
        { label: 'Apply filters', detail: 'Return to matching reviews.', href: '/user_reviews', icon: 'checkmark-outline' },
      ],
    },
  ],
  'Decline rating': [
    {
      title: 'Skip review',
      rows: [
        { label: 'No public review', detail: 'This interaction will not receive feedback from you.', icon: 'eye-off-outline' },
        { label: 'Back to history', detail: 'Return to completed work.', href: '/history_page', icon: 'time-outline' },
      ],
    },
  ],
  'Post actions': [
    {
      title: 'Manage listing',
      rows: [
        { label: 'Edit post', detail: 'Update title, budget, timing, or scope.', href: '/help_request_form', icon: 'create-outline' },
        { label: 'Hide post', detail: 'Pause visibility without deleting responses.', icon: 'eye-off-outline', tone: 'warning' },
        { label: 'Delete post', detail: 'Remove this listing.', href: '/delete_post_confirmation', icon: 'trash-outline', tone: 'danger' },
      ],
    },
  ],
  'Delete post': [
    {
      title: 'Confirm deletion',
      rows: [
        { label: 'Responses affected', detail: 'Applicants and active offers lose this listing context.', icon: 'people-outline', tone: 'warning' },
        { label: 'Delete permanently', detail: 'This cannot be undone.', icon: 'trash-outline', tone: 'danger' },
      ],
    },
  ],
  Gallery: [
    {
      title: 'Proof and media',
      rows: [
        { label: 'Photos', detail: 'Show finished work and relevant evidence.', icon: 'images-outline' },
        { label: 'Documents', detail: 'Attach certificates, CV, and licenses.', icon: 'document-attach-outline' },
        { label: 'Share profile', detail: 'Send your public profile.', href: '/share_profile', icon: 'share-social-outline' },
      ],
    },
  ],
  'Share profile': [
    {
      title: 'Profile reach',
      rows: [
        { label: 'Copy public profile', detail: 'Send your profile to customers or collaborators.', icon: 'copy-outline' },
        { label: 'Social links', detail: 'Connect public proof and professional presence.', href: '/social_links', icon: 'link-outline' },
      ],
    },
  ],
  'Social links': [
    {
      title: 'Public proof',
      rows: [
        { label: 'Portfolio', detail: 'Add a website or portfolio link.', icon: 'globe-outline' },
        { label: 'LinkedIn', detail: 'Connect a professional profile.', icon: 'logo-linkedin' },
        { label: 'Verification', detail: 'Keep links aligned with trust signals.', href: '/verification_pending_email', icon: 'shield-checkmark-outline' },
      ],
    },
  ],
  'Check your email': [
    {
      title: 'Verification',
      rows: [
        { label: 'Email pending', detail: 'Finish verification from your inbox.', icon: 'mail-outline', tone: 'warning' },
        { label: 'Verify phone', detail: 'Add another trust signal.', href: '/phone_verification', icon: 'call-outline' },
      ],
    },
  ],
  'Verify phone': [
    {
      title: 'Phone verification',
      rows: [
        { label: 'Phone number', detail: 'Used for account recovery and trust.', icon: 'call-outline' },
        { label: 'One-time code', detail: 'Enter the code sent to your phone.', icon: 'keypad-outline' },
      ],
    },
  ],
  Expertise: [
    {
      title: 'Skills',
      rows: [
        { label: 'Primary skills', detail: 'Choose the work you want to be found for.', icon: 'pricetags-outline' },
        { label: 'Certificates', detail: 'Attach proof where it matters.', href: '/gallery_view', icon: 'ribbon-outline' },
        { label: 'Availability', detail: 'Tell customers when you can work.', href: '/onboarding_availability', icon: 'calendar-outline' },
      ],
    },
  ],
  Availability: [
    {
      title: 'Working times',
      rows: [
        { label: 'Weekdays', detail: 'Default availability for nearby requests.', icon: 'calendar-outline' },
        { label: 'Weekends', detail: 'Optional high-demand windows.', icon: 'sunny-outline' },
        { label: 'Remote work', detail: 'Mark services that do not need an address.', icon: 'laptop-outline' },
      ],
    },
  ],
  'Invite friends': [
    {
      title: 'Invite trusted people',
      rows: [
        { label: 'Customer invite', detail: 'Help someone post a job safely.', icon: 'person-add-outline' },
        { label: 'Pro invite', detail: 'Bring skilled workers into SideHuzle.', icon: 'shield-checkmark-outline' },
      ],
    },
  ],
  Conversation: [
    {
      title: 'Message context',
      rows: [
        { label: 'Listing snapshot', detail: 'Keep the job or service attached to the chat.', icon: 'briefcase-outline' },
        { label: 'Review offer', detail: 'Check rate, timing, and scope.', href: '/chat_offer_review', icon: 'document-text-outline' },
        { label: 'Report issue', detail: 'Send safety context to support.', href: '/report_reason_selection', icon: 'flag-outline', tone: 'warning' },
      ],
    },
  ],
  'Review offer': [
    {
      title: 'Offer details',
      rows: [
        { label: 'Scope', detail: 'What is included and what is not.', icon: 'list-outline' },
        { label: 'Price and timing', detail: 'Confirm rate, date, and availability.', icon: 'cash-outline' },
        { label: 'Continue chat', detail: 'Ask clarifying questions before accepting.', href: '/chat_thread', icon: 'chatbubble-ellipses-outline' },
      ],
    },
  ],
  'Job posted': [
    {
      title: 'Next steps',
      rows: [
        { label: 'Review applicants', detail: 'New offers and questions appear in your posts overview.', href: '/applicants_list', icon: 'people-outline' },
        { label: 'Manage post', detail: 'Edit, hide, or delete the listing.', href: '/post_actions_sheet', icon: 'ellipsis-horizontal-circle-outline' },
        { label: 'Back to marketplace', detail: 'Return to nearby work.', href: '/(tabs)/landing_page', icon: 'map-outline' },
      ],
    },
  ],
  'Service listed': [
    {
      title: 'Next steps',
      rows: [
        { label: 'Public profile', detail: 'Customers can discover your offer from your profile.', href: '/user_profile_external', icon: 'person-outline' },
        { label: 'Availability', detail: 'Keep your working times fresh.', href: '/onboarding_availability', icon: 'calendar-outline' },
        { label: 'Back to marketplace', detail: 'Return to nearby jobs and services.', href: '/(tabs)/landing_page', icon: 'map-outline' },
      ],
    },
  ],
  'Request sent': [
    {
      title: 'Next steps',
      rows: [
        { label: 'Conversation', detail: 'The worker can respond with availability and pricing.', href: '/chat_thread', icon: 'chatbubble-ellipses-outline' },
        { label: 'Requests', detail: 'Track active requests from the messages tab.', href: '/(tabs)/requests_posts_hub', icon: 'chatbubbles-outline' },
      ],
    },
  ],
  'Offer submitted': [
    {
      title: 'Next steps',
      rows: [
        { label: 'Conversation', detail: 'The customer can ask questions or accept terms.', href: '/chat_thread', icon: 'chatbubble-ellipses-outline' },
        { label: 'Posted jobs', detail: 'Find more open work nearby.', href: '/search_screen', icon: 'search-outline' },
      ],
    },
  ],
  'You are signed in': [
    {
      title: 'Account ready',
      rows: [
        { label: 'Profile hub', detail: 'Manage trust, posts, services, and payments.', href: '/(tabs)/account_profile', icon: 'person-outline' },
        { label: 'Post Job', detail: 'Create a customer request.', href: '/help_request_form', icon: 'briefcase-outline' },
        { label: 'Offer Service', detail: 'Publish a service profile.', href: '/worker_service_form', icon: 'shield-checkmark-outline' },
      ],
    },
  ],
  'Reset password': [
    {
      title: 'Recovery',
      rows: [
        { label: 'Email address', detail: 'Use the address connected to your account.', icon: 'mail-outline' },
        { label: 'Verification link', detail: 'Open the reset link from your inbox.', icon: 'link-outline' },
        { label: 'Log in', detail: 'Return when your password is changed.', href: '/login_form', icon: 'log-in-outline' },
      ],
    },
  ],
  'Notification settings': [
    {
      title: 'Notification types',
      rows: [
        { label: 'Messages and offers', detail: 'New chat, applicant, and offer updates.', icon: 'chatbubbles-outline' },
        { label: 'Job and service activity', detail: 'Saved searches, listing matches, and reminders.', icon: 'briefcase-outline' },
        { label: 'Quiet hours', detail: 'Keep urgent trust updates visible.', icon: 'moon-outline' },
      ],
    },
  ],
  'Privacy settings': [
    {
      title: 'Visibility',
      rows: [
        { label: 'Profile visibility', detail: 'Control which public details appear to customers and pros.', icon: 'eye-outline' },
        { label: 'Location precision', detail: 'Show approximate distance until a booking is confirmed.', icon: 'location-outline' },
        { label: 'Blocked users', detail: 'Manage safety boundaries.', icon: 'ban-outline' },
      ],
    },
  ],
  'Data settings': [
    {
      title: 'Account data',
      rows: [
        { label: 'Export data', detail: 'Download profile, messages, posts, and payment metadata.', icon: 'download-outline' },
        { label: 'Deletion controls', detail: 'Review data removal before closing the account.', href: '/deactivate_account', icon: 'trash-outline', tone: 'danger' },
      ],
    },
  ],
  Imprint: [
    {
      title: 'Company information',
      rows: [
        { label: 'Legal entity', detail: 'SideHuzle marketplace operator details.', icon: 'business-outline' },
        { label: 'Support', detail: 'Questions about trust, payments, or account access.', href: '/help_request_form', icon: 'help-circle-outline' },
      ],
    },
  ],
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numericParam(value: string | string[] | undefined) {
  const parsed = Number(firstParam(value));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function searchHref(query: string) {
  return `/search_results?q=${encodeURIComponent(query)}`;
}

function categoryRows(categories: CategoryRecord[], title: string): RouteRow[] {
  return categories.slice(0, 8).map((category) => ({
    label: category.name,
    detail: title === 'Categories' ? 'Browse jobs and pros in this category.' : 'Open matching jobs and service profiles.',
    href: title === 'Categories' ? `/subcategories_list?categoryId=${category.id}&category=${encodeURIComponent(category.name)}` : searchHref(category.name),
    icon: title === 'Categories' ? 'grid-outline' : 'pricetag-outline',
  }));
}

function taskMeta(task: Task) {
  if (typeof task.price !== 'number') return task.task_type === 'tasker' ? 'Service' : 'Job';
  const suffix = task.price_type === 'per_hour' ? '/h' : task.price_type === 'per_day' ? '/day' : '';
  return `€${Math.round(task.price)}${suffix}`;
}

function taskHref(task: Task) {
  const pathname = task.task_type === 'tasker' ? '/worker_description' : '/job_description';
  return `${pathname}?id=${task.id}`;
}

function taskRows(tasks: Task[]): RouteRow[] {
  return tasks.slice(0, 6).map((task) => ({
    label: task.name,
    detail: task.short_description || task.description,
    href: taskHref(task),
    icon: task.task_type === 'tasker' ? 'shield-checkmark-outline' : 'briefcase-outline',
    meta: taskMeta(task),
    tone: task.active === false ? 'warning' : 'default',
  }));
}

function chatRows(threads: ChatRoom[]): RouteRow[] {
  return threads.slice(0, 8).map((thread) => {
    const lastMessage = thread.messages[thread.messages.length - 1];
    return {
      label: `Task #${thread.task_id}`,
      detail: lastMessage?.content ?? 'No messages yet',
      href: `/chat_thread?id=${thread.id}`,
      icon: 'chatbubble-ellipses-outline',
      meta: thread.messages.length ? String(thread.messages.length) : undefined,
    };
  });
}

function messageRows(messages: ChatMessage[]): RouteRow[] {
  return messages.slice(-8).map((message) => ({
    label: `User ${message.sender_id}`,
    detail: message.content,
    icon: 'chatbubble-outline',
    meta: new Date(message.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));
}

function profileName(user: UserRead) {
  return user.name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email;
}

function profileSections(user: UserRead, fallback: RouteSection[], title: string): RouteSection[] {
  const profileRows: RouteRow[] = [
    { label: profileName(user), detail: user.email, icon: 'person-circle-outline', meta: user.active === false ? 'Inactive' : 'Active', tone: user.active === false ? 'warning' : 'positive' },
    { label: user.username ? `@${user.username}` : 'Username not set', detail: 'Public handle and discovery identity.', icon: 'at-outline' },
    { label: `Profile #${user.id}`, detail: 'Backend-backed account reference.', icon: 'finger-print-outline' },
  ];

  return [
    { title: title === 'Account settings' ? 'Signed-in account' : 'Live profile', body: 'Loaded from the existing user session/profile contract.', rows: profileRows },
    ...fallback,
  ];
}

function useLiveRouteSections(title: string, fallback: RouteSection[], enabled: boolean) {
  const params = useLocalSearchParams<RouteParams>();
  const categoryId = numericParam(params.categoryId);
  const categoryName = firstParam(params.category);
  const threadId = firstParam(params.id);
  const profileId = firstParam(params.userId) ?? (title === 'Public profile' ? firstParam(params.id) : undefined);
  const needsCategories = enabled && (title === 'Categories' || title === 'Subcategories' || title === 'Expertise');
  const needsPostedTasks = enabled && title === 'Posted jobs';
  const needsChats = enabled && (title === 'Applicants' || title === 'Conversation');
  const needsMessages = needsChats && title === 'Conversation' && Boolean(threadId);
  const needsProfile = enabled && (title === 'Public profile' || title === 'Account settings' || title === 'Posted jobs');

  const categoriesQuery = useQuery({
    queryKey: ['route-scaffold', 'categories'],
    queryFn: getCategories,
    enabled: needsCategories,
    throwOnError: false,
    staleTime: 60_000,
  });

  const tasksQuery = useQuery({
    queryKey: ['route-scaffold', 'posted-tasks'],
    queryFn: () => searchTasks({ limit: 48, task_type: 'task' }),
    enabled: needsPostedTasks,
    throwOnError: false,
    staleTime: 30_000,
  });

  const chatsQuery = useQuery({
    queryKey: ['route-scaffold', 'chats'],
    queryFn: getChatThreads,
    enabled: needsChats,
    throwOnError: false,
    staleTime: 30_000,
  });

  const messagesQuery = useQuery({
    queryKey: ['route-scaffold', 'chat-messages', threadId],
    queryFn: () => getChatMessages(threadId as string),
    enabled: needsMessages,
    throwOnError: false,
    staleTime: 10_000,
  });

  const profileQuery = useQuery({
    queryKey: ['route-scaffold', 'profile', profileId ?? 'me'],
    queryFn: () => (profileId ? getUserProfile(profileId) : getCurrentUser()),
    enabled: needsProfile,
    throwOnError: false,
    staleTime: 30_000,
  });

  return useMemo(() => {
    if (!enabled) return fallback;

    if (title === 'Categories' && categoriesQuery.data?.length) {
      const roots = categoriesQuery.data.filter((category) => category.parent_id == null);
      const categories = roots.length ? roots : categoriesQuery.data;
      return [
        {
          title: 'Live categories',
          body: 'Loaded from the marketplace category contract.',
          rows: categoryRows(categories, title),
        },
        ...(fallback.find((section) => section.title === 'Discovery') ? fallback.filter((section) => section.title === 'Discovery') : []),
      ];
    }

    if (title === 'Subcategories' && categoriesQuery.data?.length) {
      const children = categoryId ? categoriesQuery.data.filter((category) => category.parent_id === categoryId) : categoriesQuery.data.filter((category) => category.parent_id != null);
      const rows = categoryRows(children.length ? children : categoriesQuery.data, title);
      return [
        {
          title: categoryName ? `${categoryName} services` : 'Live subcategories',
          body: 'Loaded from the marketplace category contract.',
          rows,
        },
      ];
    }

    if (title === 'Expertise' && categoriesQuery.data?.length) {
      return [
        {
          title: 'Marketplace skills',
          body: 'Choose from live marketplace categories when completing your profile.',
          rows: categoryRows(categoriesQuery.data, 'Subcategories'),
        },
        ...fallback,
      ];
    }

    if (title === 'Posted jobs' && tasksQuery.data?.length && profileQuery.data) {
      const ownTasks = tasksQuery.data.filter((task) => task.user_id === profileQuery.data.id);
      if (ownTasks.length) {
        return [
          {
            title: 'Posted from your account',
            body: 'Loaded from the existing task search contract.',
            rows: taskRows(ownTasks),
          },
          ...fallback.filter((section) => section.title !== 'Posted work'),
        ];
      }
    }

    if (title === 'Applicants' && chatsQuery.data?.length) {
      return [
        {
          title: 'Active response threads',
          body: 'Loaded from the existing chat-room contract.',
          rows: chatRows(chatsQuery.data),
        },
        ...fallback,
      ];
    }

    if (title === 'Conversation') {
      if (messagesQuery.data?.length) {
        return [
          {
            title: 'Messages',
            body: 'Loaded from the existing chat-message contract.',
            rows: messageRows(messagesQuery.data),
          },
          ...fallback,
        ];
      }
      if (chatsQuery.data?.length) {
        return [
          {
            title: 'Conversations',
            body: 'Loaded from the existing chat-room contract.',
            rows: chatRows(chatsQuery.data),
          },
          ...fallback,
        ];
      }
    }

    if ((title === 'Public profile' || title === 'Account settings') && profileQuery.data) {
      return profileSections(profileQuery.data, fallback, title);
    }

    return fallback;
  }, [categoryId, categoryName, categoriesQuery.data, chatsQuery.data, enabled, fallback, messagesQuery.data, profileQuery.data, tasksQuery.data, title]);
}

function toneColor(tone: RouteRow['tone'] | undefined, c: ReturnType<typeof useThemeColors>) {
  if (tone === 'positive') return c.accent_positive;
  if (tone === 'warning') return c.accent_warning;
  if (tone === 'danger') return c.accent_danger;
  return c.accent_primary;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function GenericRouteScreen({ eyebrow = 'Sidehuzle', title, body, icon = 'sparkles-outline', actions = [], sections, testID }: Props) {
  const router = useRouter();
  const c = useThemeColors();
  const fallbackSections = sections ?? defaultSections[title] ?? [];
  const routeSections = useLiveRouteSections(title, fallbackSections, sections == null);

  return (
    <ScreenShell scroll maxWidth="md" contentClassName="gap-side-lg pb-28" testID={testID}>
      <GlassSurface variant="elevated" className="gap-side-lg p-side-xl">
        <View className="size-12 items-center justify-center rounded-lg bg-primary/10">
          <Ionicons name={icon} size={24} color={c.accent_primary} />
        </View>
        <View className="gap-side-sm">
          <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px] text-primary">{eyebrow}</Text>
          <Text className="text-[30px] font-black leading-[36px]">{title}</Text>
          {body ? <Text className="text-[14px] leading-[22px] text-muted-foreground">{body}</Text> : null}
        </View>
      </GlassSurface>

      {routeSections.map((section) => (
        <GlassSurface key={section.title} variant="surface" className="gap-side-md p-side-lg" testID={`route-section-${slug(section.title)}`}>
          <View className="gap-side-xs">
            <Text className="text-[17px] font-bold leading-6" style={{ color: c.text_primary }}>
              {section.title}
            </Text>
            {section.body ? (
              <Text className="text-[14px] leading-[21px]" style={{ color: c.text_secondary }}>
                {section.body}
              </Text>
            ) : null}
          </View>

          <View>
            {section.rows.map((row, index) => {
              const content = (
                <>
                  <View className="size-10 items-center justify-center rounded-lg bg-secondary">
                    <Ionicons name={row.icon ?? 'ellipse-outline'} size={18} color={toneColor(row.tone, c)} />
                  </View>
                  <View className="min-w-0 flex-1 gap-[2px]">
                    <View className="flex-row items-center gap-side-sm">
                      <Text className="min-w-0 flex-1 text-[15px] font-bold leading-5" style={{ color: c.text_primary }} numberOfLines={1}>
                        {row.label}
                      </Text>
                      {row.meta ? (
                        <Text className="text-[12px] font-extrabold leading-4" style={{ color: toneColor(row.tone, c) }}>
                          {row.meta}
                        </Text>
                      ) : null}
                    </View>
                    {row.detail ? (
                      <Text className="text-[13px] leading-[18px]" style={{ color: c.text_secondary }} numberOfLines={2}>
                        {row.detail}
                      </Text>
                    ) : null}
                  </View>
                  {row.href ? <Ionicons name="chevron-forward" size={16} color={c.text_secondary} /> : null}
                </>
              );
              const rowClassName = 'min-h-[64px] flex-row items-center gap-side-md py-side-sm';
              const rowStyle = index === 0 ? undefined : { borderTopWidth: 1, borderTopColor: c.border_subtle };

              if (row.href) {
                return (
                  <Pressable
                    key={`${section.title}-${row.label}`}
                    accessibilityRole="button"
                    accessibilityLabel={row.label}
                    onPress={() => router.push(row.href as never)}
                    className={`${rowClassName} web:cursor-pointer`}
                    style={rowStyle}
                  >
                    {content}
                  </Pressable>
                );
              }

              return (
                <View key={`${section.title}-${row.label}`} className={rowClassName} style={rowStyle}>
                  {content}
                </View>
              );
            })}
          </View>
        </GlassSurface>
      ))}

      {actions.length ? (
        <GlassSurface variant="surface" className="items-center gap-side-md p-side-lg">
          <Text className="text-center text-[17px] font-bold leading-6">Next Steps</Text>
          <View className="w-full flex-row flex-wrap justify-center gap-side-sm">
            {actions.map((action) => (
              <Button
                key={action.href}
                label={action.label}
                icon={action.icon}
                variant={action.variant ?? 'secondary'}
                className="min-w-[160px] max-w-[220px]"
                onPress={() => router.push(action.href as never)}
              />
            ))}
          </View>
        </GlassSurface>
      ) : null}
    </ScreenShell>
  );
}
