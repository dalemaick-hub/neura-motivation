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

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tu frase del día',
      body: 'NEURA tiene algo para decirte hoy.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });

  return { status: 'enabled' };
}
