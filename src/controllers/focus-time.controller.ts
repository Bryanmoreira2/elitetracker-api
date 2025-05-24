import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import { z } from 'zod';

import { focusTimeModel } from '../models/focus-time.model';
import { buildValidationErroMessagen } from '../utils/build-validation-error-message.util';

export class FocusTimeController {
    store = async (request: Request, response: Response) => {
        const schemas = z.object({
            timeFrom: z.coerce.date(),
            timeTo: z.coerce.date(),
        });

        const focusTime = schemas.safeParse(request.body);

        if (!focusTime.success) {
            const errors = buildValidationErroMessagen(focusTime.error.issues);
            return response.status(402).json({ message: errors });
        }

        const timeFrom = dayjs(focusTime.data?.timeFrom);
        const timeTo = dayjs(focusTime.data?.timeTo);

        const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);

        if (isTimeToBeforeTimeFrom) {
            return response
                .status(400)
                .json({ message: 'Time To cannot be in the past ' });
        }

        const createdFocusTime = await focusTimeModel.create({
            timeFrom: timeFrom.toDate(),
            timeTo: timeTo.toDate(),
        });

        return response.status(201).json(createdFocusTime);
    };
}
