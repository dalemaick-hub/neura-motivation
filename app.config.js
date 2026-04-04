import appJson from './app.json';

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo?.extra ?? {}),
      EXPO_PUBLIC_SUPABASE_URL: 'https://iboteqiyqqljpbkflkew.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_TU_KEY_AQUI',
    },
  },
};
