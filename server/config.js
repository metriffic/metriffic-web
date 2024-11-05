import env from 'env-var';

export const config = {
    GQL_ADDRESS: env.get('METRIFFIC_GQL_ADDRESS').required().asString(),
    GQL_ENDPOINT: 'web_client',
    WEB_CLIENT_PRIVATE_KEY_FILE: env.get('METRIFFIC_WEB_CLIENT_PRIVATE_KEY_FILE').required().asString(),
    WEB_CLIENT_EMAIL_PASSWORD: env.get('METRIFFIC_WEB_CLIENT_EMAIL_PASSWORD').required().asString()
}
