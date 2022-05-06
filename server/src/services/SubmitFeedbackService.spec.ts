import { SubmitFeedbackService } from "./SubmitFeedbackService";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedback = new SubmitFeedbackService(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
);

describe('Submit feedback', () => {
    it('should be able to submit a feedback', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'Comment',
            screenshot: 'data:image/png;base64;asdqweasdqwe'
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    });

    it('should not be able to submit a feedback without type', async () => {
        await expect(submitFeedback.execute({
            type: '',
            comment: 'Comment',
            screenshot: 'data:image/png;base64;asdqweasdqwe'
        })).rejects.toThrow();
    });

    it('should not be able to submit a feedback without comment', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: '',
            screenshot: 'data:image/png;base64;asdqweasdqwe'
        })).rejects.toThrow();
    });

    it('should not be able to submit a feedback with an invalid screenshot image', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'Comment',
            screenshot: 'invalid'
        })).rejects.toThrow();
    });
});