import {z} from 'zod';

export const listUserAlertsRequestSchema = z.object({
  userId: z.string(),
});

export const addAlertRequestSchema = z.object({
  userId: z.string(),
  senderName: z.string(),
  message: z.string().optional(),
  tipAmount: z.string(),
});

export const dropAlertRequestSchema = z.object({
  alertId: z.string(),
  userId: z.string(),
});

export type AlertData = {
  id: string;
  senderName: string;
  message: string;
  tipAmount: string;
};
