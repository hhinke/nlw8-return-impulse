import { MailAdapter, MailAdapterData } from "../MailAdapter";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "4dacebbb3d29e7",
        pass: "bf3656c779c9e6"
    }
});

export class NodeMailerAdapter implements MailAdapter {
    async sendMail({ subject, body }: MailAdapterData) {
        await transport.sendMail({
            from: 'Equipe Feedget <oi@feedget.com>',
            to: 'Henrique Hinke <hhinke@gmail.com>',
            subject,
            html: body,
        });
    }
}