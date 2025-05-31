import axios, { isAxiosError } from 'axios';
import { Request, Response } from 'express';

const clientId = 'Ov23liqInf8w6Q5hY1RO';
const clientSecret = '71b0a955b25669c278bf7a4a6163868c74f425d7';

export class AuthController {
    auth = async (request: Request, response: Response) => {
        const redirecUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;

        response.redirect(redirecUrl);
    };

    authCallback = async (request: Request, response: Response) => {
        try {
            const { code } = request.query;

            const aceessTokenResult = await axios.post(
                `https://github.com/login/oauth/access_token`,
                {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            const userDataResult = await axios.get(
                'https://api.github.com/user',
                {
                    headers: {
                        Authorization: `Bearer ${aceessTokenResult.data.access_token}`,
                    },
                },
            );

            const {
                node_id: id,
                avatar_url: avatarUrl,
                name,
            } = userDataResult.data;

            return response.status(200).json({ id, avatarUrl, name });
        } catch (err) {
            if (isAxiosError(err)) {
                return response.status(400).json(err.request?.data);
            }
            return response
                .status(500)
                .json({ message: 'Something went wrong' });
        }
    };
}
