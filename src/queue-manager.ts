import type {AlertData} from './types';

export type AlertQueueManagerInterface = {
  getAlertsByUserId(userId: string): AlertData[];
  addAlert(userId: string, alert: AlertData): void;
  dropAlert(userId: string, alertId: string): void;
};

export class MemoryAlertQueueManager implements AlertQueueManagerInterface {
  private readonly userToAlertMapping = new Map<string, AlertData[]>();

  getAlertsByUserId(userId: string): AlertData[] {
    return this.userToAlertMapping.get(userId) ?? [];
  }

  addAlert(userId: string, alert: AlertData): void {
    const oldAlerts = this.userToAlertMapping.get(userId);
    if (oldAlerts) {
      this.userToAlertMapping.set(userId, [...oldAlerts, alert]);
    } else {
      this.userToAlertMapping.set(userId, [alert]);
    }
  }

  dropAlert(userId: string, alertId: string): void {
    const oldAlerts = this.userToAlertMapping.get(userId);
    if (oldAlerts) {
      this.userToAlertMapping.set(
        userId,
        oldAlerts.filter((alert) => alert.id !== alertId),
      );
    }
  }
}
