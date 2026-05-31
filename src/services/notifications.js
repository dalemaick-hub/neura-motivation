import { generateQuote } from './ai';
import { getDailyQuoteHistory, getOrCreateTodaysQuote } from './dailyQuote';
import { getSelectedCategory } from './preferences';

function getNextTriggerDate(daysFromToday) {
  const next = new Date();
  next.setHours(9, 0, 0, 0);
  next.setDate(next.getDate() + daysFromToday);
  return next;
}

export async function setupNotifications() {
  let Notifications;

  try {
    Notifications = require('expo-notifications');
  } catch (_error) {
    return { status: 'unavailable' };
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    return { status: 'denied' };
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const categoryId = await getSelectedCategory();
  const todayQuote = await getOrCreateTodaysQuote(categoryId);
  const history = await getDailyQuoteHistory();
  const exclusions = [todayQuote.text, ...history.map((item) => item.text)].slice(0, 15);
  const scheduledQuotes = [];

  for (let i = 0; i < 7; i += 1) {
    const quote = await generateQuote(categoryId, [...exclusions, ...scheduledQuotes]);
    scheduledQuotes.push(quote);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tu frase del día',
        body: quote,
      },
      trigger: getNextTriggerDate(i + 1),
    });
  }

  return { status: 'enabled' };
}
