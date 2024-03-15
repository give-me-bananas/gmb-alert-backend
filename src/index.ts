import express from 'express';
import cors from 'cors';
import {v4 as uuidV4} from 'uuid';
import {MemoryAlertQueueManager} from './queue-manager';
import {
  addAlertRequestSchema,
  dropAlertRequestSchema,
  listUserAlertsRequestSchema,
} from './types';

const main = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  const alertQueueManager = new MemoryAlertQueueManager();

  app.get('/users/:userId/alerts', async (request, response) => {
    const validation = listUserAlertsRequestSchema.safeParse(request.params);
    if (!validation.success) {
      return response.status(400).json({error: 'invalid user id'});
    }

    const {userId} = validation.data;
    const alerts = alertQueueManager.getAlertsByUserId(userId);

    return response.status(200).json({user: userId, alerts});
  });

  app.post('/users/:userId/alerts', async (request, response) => {
    const validation = addAlertRequestSchema.safeParse({
      ...request.params,
      ...request.body,
    });

    if (!validation.success) {
      return response.status(400).json({error: 'invalid data'});
    }

    const {senderName, tipAmount, userId, message} = validation.data;
    const alertId = uuidV4();

    alertQueueManager.addAlert(userId, {
      id: alertId,
      message: message ?? '',
      senderName,
      tipAmount,
    });

    return response.status(201).json({id: alertId});
  });

  app.delete('/users/:userId/alerts/:alertId', async (request, response) => {
    const validation = dropAlertRequestSchema.safeParse(request.params);

    if (!validation.success) {
      return response.status(400).json({error: 'invalid params'});
    }

    const {alertId, userId} = validation.data;
    alertQueueManager.dropAlert(userId, alertId);
    return response.status(204).send();
  });

  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
};

main();
