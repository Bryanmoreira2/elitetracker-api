import { Schema, model } from 'mongoose';

const HabitSchemas = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        completedDates: {
            type: [Date],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const habitModel = model('Habit', HabitSchemas);
