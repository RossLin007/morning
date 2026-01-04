import { TranslationType } from './zh-CN';

export const enUS: TranslationType = {
  common: {
    loading: 'Loading...', 
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    finish: 'Finish',
    settings: 'Settings',
    send: 'Send',
    search: 'Search',
    online: 'Online',
    offline: 'Offline',
  },
  dashboard: {
    subtitle: 'Morning Ritual',
    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    greeting_late: 'Good Night',
    quote_default: 'Stay focused, the present is eternal.',
    quote_morning: 'The early bird catches the worm.',
    quote_night: 'The world sleeps, your soul is awake.',
    partner_water_needed: 'Need Water',
    partner_watered: 'Accompanied',
    todays_practice: "Today's Practice",
    practice_time: '15 Min Session',
    streak_title: 'Current Streak',
    streak_desc: 'You have stayed for <span class="text-orange-400 font-bold">{days}</span> days, beating 85% of students',
    notifications_title: 'Notifications',
    social_ticker: {
        checkin: '{name} completed Day {day} check-in',
        join: '{name} joined the room',
        badge: '{name} earned the [{badge}] badge',
        focus: '{name} started focusing'
    },
    quick_actions: {
        notes: 'Notes',
        history: 'Footprint',
        community: 'Community',
        coach: 'AI Coach'
    },
    announcements: {
      title: 'Announcements',
      live_meditation: {
        title: 'Morning Meditation',
        content: 'Tomorrow at 6:30, we will have a 5-minute meditation session.',
        time: '10m ago'
      }
    },
    zen_quote: {
      content: 'Being proactive is more than taking initiative. It is about being responsible for our own choices.',
      author: 'Stephen Covey'
    },
    hero_course: {
      tag: 'Habit 01',
      title: 'Be Proactive',
      subtitle: 'Day 05 · Awakening Vision'
    }
  },
  profile: {
    title: 'Profile',
    no_bio: 'No bio yet',
    level: 'Lv.{level}',
    edit_profile: 'Edit Profile',
    account_security: 'Security',
    vip: {
        active_title: 'Morning Reader PRO',
        inactive_title: 'Upgrade to PRO',
        active_desc: 'Valid until 2024.12.31',
        inactive_desc: 'Unlock AI Coach & Cloud Sync'
    },
    sections: {
        learning: 'My Learning',
        settings: 'Settings',
        data: 'Data Zone'
    },
    menu: {
        report: 'Learning Report',
        report_desc: 'View detailed data',
        relationships: 'Partners & Mentors',
        relationships_desc: '{count} partners',
        certificates: 'Certificates',
        certificates_desc: '{count} unlocked',
        dark_mode: 'Dark Mode',
        daily_reminder: 'Daily Reminder',
        clear_data: 'Reset Data',
        clear_data_desc: 'Dangerous, cannot be undone',
        logout: 'Log Out'
    },
    radar: {
        grit: 'Grit',
        wisdom: 'Wisdom',
        insight: 'Insight',
        influence: 'Influence',
        focus: 'Focus'
    },
    toast: {
        logout: 'Logged out safely',
        reminder_saved: 'Reminder settings saved'
    }
  },
  roles: {
    buddy: 'Buddy',
    mentor: 'Mentor',
    mentee: 'Mentee',
  },
  roles_desc: {
    buddy: 'Walk together, urge each other',
    mentor: 'Guide the way, answer questions',
    mentee: 'Learn humbly, improve daily',
  },
  relationships: {
    title: 'Ecosystem',
    no_partner: 'No {role} yet',
    no_partner_desc: '{desc}, make growth no longer lonely.',
    find_partner: 'Find {role}',
    call_ai: 'Call AI Coach',
    no_logs: 'No interaction logs yet.',
    water_button: 'Water (+10)',
    watered_button: 'Watered',
    postcard_button: 'Send Postcard',
    nudge_button: 'Nudge',
    nudge_toast: 'Nudged {name} to learn',
    water_success: 'Watered! Bond with {name} +10',
    postcard_sent: 'Postcard sent',
    create_plan: 'Create Learning Plan',
    learning_plan_dev: 'Feature coming soon...', 
    postcard_title: 'Send Postcard',
    postcard_subtitle: 'Give your partner a warm encouragement',
    send_postcard_action: 'Send Now',
    plan_modal_title: 'Learning Plan',
    plan_modal_subtitle: 'Choose focus for next stage',
    assign_action: 'Assign Plan',
    plan_sent: 'Learning plan assigned',
    plan_card_title: 'Learning Plan',
    cards: {
        morning: 'Good morning! Wish you power today.',
        persistence: 'Persistence is the greatest quality.',
        company: 'Thanks for walking with me.',
        care: 'Remember to rest, take care.'
    }
  },
  match: {
    title: 'Soul Match',
    subtitle: 'Resonance Seeking...', 
    scan_quote: '"People with the same frequency will meet."',
    high_match: 'High Match',
    similarity: 'Similarity {rate}%',
    keep_looking: 'Keep Looking',
    establish_pledge: 'Establish {role} Pledge',
    pledge_title: 'The Pledge',
    pledge_subtitle: 'The Pledge of Growth',
    pledge_content: 'I wish to become {role} with <span class="font-bold text-primary">{name}</span>...', 
    signature: 'Signature',
    connect_fail: 'Connection failed'
  },
  actions: {
    find_partner: 'Find Partner',
  },
  coach: {
      title: 'AI Coach',
      status_sync: 'Cloud Syncing',
      status_offline: 'Offline Mode',
      intro_title: 'I am your 24h growth partner.',
      action_voice: 'Voice Call',
      placeholder_online: 'Ask AI Coach (Live Search supported)...',
      placeholder_offline: 'Disconnected',
      voice_connecting: 'CONNECTING...', 
      voice_connected: 'LIVE CONNECTED',
      voice_listening: 'Listening...', 
      voice_speaking: 'AI is speaking...', 
      voice_hangup_hint: 'Click hangup to end call',
      prompts: {
          core: 'Core of Effectiveness',
          procrastination: 'How to overcome procrastination?',
          plan: 'Make a morning plan',
          proactive: 'What is Proactive?'
      },
      confirm_clear: 'Clear chat history?',
      error_connection: 'Connection error',
      error_startup: 'Failed to start voice service'
  },
  community: {
      title: 'Community',
      search_placeholder: 'Search posts...', 
      publish_modal_title: 'Publish',
      publish_placeholder: 'What is on your mind...', 
      upload_image: 'Uploading...', 
      image_added: 'Image added',
      check_network: 'Please check network',
      input_empty: 'Please input content',
      publish_success: 'Published!',
      publish_fail: 'Failed to publish',
      live_banner_title: 'Live: Morning Ritual',
      live_banner_desc: '{count} partners focusing',
      share_hint: 'Share your thoughts...', 
      offline_hint: 'Offline mode',
      loading_sync: 'Syncing cloud data...', 
      error_connect: 'Cannot connect to community',
      retry: 'Retry',
      empty_search: 'No posts found',
      empty_list: 'No posts yet',
      load_more: 'Load more...', 
      end_of_list: 'End of list',
      offline_like_error: 'Cannot like in offline mode'
  },
  live: {
      room_title: 'Zen Room',
      status_connecting: 'CONNECTING...', 
      status_online: '{count} ONLINE',
      focus_label: 'Deep Focus',
      btn_start: 'START',
      btn_pause: 'PAUSE',
      breathe_hint: 'BREATHE IN...', 
      chat_system_init: 'Connecting to Zen field...', 
      chat_system_conn: 'Connected to Live channel',
      partner_with: 'With Partner',
      partner_focus: 'Focusing',
      partner_nudge_sent: 'Nudge sent',
      solo_mode: 'Solo Mode',
      find_partner: 'Find Partner',
      settings_title: 'Room Settings',
      setting_scene: 'Scene',
      setting_ambience: 'Ambience',
      celebration_title: 'Focus Complete',
      celebration_desc: 'Mindfulness is food for soul',
      btn_next_round: 'Next Round',
      btn_finish: 'Finish',
      bg: {
          zen: 'Morning Forest',
          cyber: 'Digital Void',
          study: 'Late Night Study'
      },
      ambience: {
          none: 'Mute',
          rain: 'Rain',
          forest: 'Forest'
      }
  },
  shop: {
      title: 'Zen Shop',
      subtitle: 'Value your practice',
      desc: 'Redeem tools or help charity.',
      balance_error: 'Insufficient Zen Coin',
      donation_success: 'Thank you for your kindness',
      redeem_success: 'Redeemed: {item}',
      loading_more: 'More items coming soon...', 
      items: {
          makeup: { title: 'Makeup Card', desc: 'Restore your streak record' },
          rain: { title: 'Rain Ambience', desc: 'Unlock high quality rain sounds' },
          tree: { title: 'Plant a Tree', desc: 'Donate coins to plant real trees' },
          theme: { title: 'Dark Gold', desc: 'Unlock premium app theme' }
      }
  },
  tasks: {
    title: 'Tasks',
    greeting_title: 'Today\'s Ritual',
    greeting_quote: '"Persistence is the key to success."',
    tabs: {
      all: 'All',
      todo: 'To-do',
      done: 'Done',
      makeup: 'Makeup'
    },
    status: {
      completed: 'Completed',
      locked: 'Unlocks tomorrow 06:00',
      tomorrow: 'Tomorrow'
    },
    action: {
      go: 'Go',
      recording: 'Voice Check-in',
      checkin_success: 'Check-in success',
      task_completed: 'Task completed',
      task_reset: 'Task reset'
    },
    required: 'Required',
    audio_modal: {
      title: 'Morning Check-in',
      subtitle: 'Read the quote to start the day',
      quote: '"Success is not final, failure is not fatal: it is the courage to continue that counts."'
    }
  },
  reading: {
    title: 'Learning Path',
    search_placeholder: 'Search courses...', 
    hero: {
      title: 'Mindfulness · Change',
      level: 'Level {level}: Practitioner',
      progress: 'Completed {completed}/{total} lessons'
    },
    chapter: {
      locked_desc: 'More lessons coming soon...' 
    },
    action: {
      start: 'Start',
      review: 'Review'
    }
  },
  settings: {
    title: 'Settings',
    install: {
      title: 'Install App',
      desc: 'Add to home screen for better experience'
    },
    cloud: {
      title: 'Cloud',
      sync_data: 'Sync Data',
      last_sync: 'Last Sync: {time}',
      sync_now: 'Sync Now',
      syncing: 'Syncing...', 
      success: 'Data synced to cloud'
    },
    preferences: {
      title: 'Preferences',
      notifications: 'Notifications',
      notifications_desc: 'Request notification permission',
      haptics: 'Haptics',
      privacy: 'Privacy Mode',
      privacy_desc: 'Hide my progress in community'
    },
    account: {
      title: 'Account'
    },
    data: {
      title: 'Data Zone',
      clear: 'Reset Data',
      clear_desc: 'Dangerous, cannot be undone',
      clear_confirm: 'Are you sure you want to clear all local data? This will reset your progress, notes and records.',
      reset_success: 'Data reset success'
    },
    footer: {
      slogan: 'Designed for Mindfulness & Growth'
    }
  },
  login: {
    app_name: 'Morning Reader',
    slogan: 'Wake up your every morning',
    tab_password: 'Password',
    tab_phone: 'Phone OTP',
    input: {
      phone: 'Phone Number',
      code: 'OTP',
      get_code: 'Get OTP',
      email: 'Email',
      password: 'Password'
    },
    btn: {
      login_register: 'Login / Register',
      enter: 'Enter App',
      register: 'Register',
      guest: 'Try as Guest'
    },
    switch: {
      to_register: 'No account? Register',
      to_login: 'Has account? Login',
      forgot: 'Forgot password?'
    },
    agreement: {
      prefix: 'I have read and agree to',
      user_ag: 'User Agreement',
      privacy: 'Privacy Policy',
      error: 'Please agree to user agreement first'
    },
    toast: {
      code_sent: 'OTP sent',
      register_success: 'Register success, please login'
    }
  }
};
