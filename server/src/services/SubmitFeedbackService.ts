import { MailAdapter } from "../adapters/MailAdapter";
import { FeedbacksRepository } from "../repositories/FeedbacksRepository";

interface SubmitFeedbackServiceRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackService {
    constructor(private feedbacksRepository: FeedbacksRepository, private mailAdapter: MailAdapter) {        
    }

    async execute(request: SubmitFeedbackServiceRequest) {
        const { type, comment, screenshot } = request;

        if(!type) {
            throw new Error('type is requires');
        }

        if(!comment) {
            throw new Error('comment is requires');
        }

        if(screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Invalid screenshot format');
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot
        });

        await this.mailAdapter.sendMail({
            subject: 'Novo Feedback',
            body:  [
                `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
                `<p>Tipo do Feedback: ${type}</p>`,
                `<p>Comentario: ${comment}</p>`,
                 screenshot ? `<img src="${screenshot}" />` : '',
                `</div>`
            ].join('\n')
        })
    }
}