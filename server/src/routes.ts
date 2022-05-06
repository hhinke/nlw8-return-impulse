import express, { Request, Response } from 'express';
import { SubmitFeedbackService } from './services/SubmitFeedbackService';
import { PrismaFeedbacksRepository } from './repositories/prisma/PrismaFeedbacksRepository';
import { NodeMailerAdapter } from './adapters/NodeMailer/NodeMailerAdapter';

export const routes = express.Router();

routes.post('/feedbacks', async (req: Request, res: Response) => {
    const { type, comment, screenshot } = req.body;

    const submitFeedbackService = new SubmitFeedbackService(
        new PrismaFeedbacksRepository(), 
        new NodeMailerAdapter()
    );

    await submitFeedbackService.execute({
        type,
        comment,
        screenshot
    });   

    res.status(201).send();
});