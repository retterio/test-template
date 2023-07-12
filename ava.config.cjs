module.exports = {
  timeout: '180s',
  files: ['**/__tests__/**/*.ava.ts', '**/__tests__/**/*.ava.ts', '**/__tests__/**/*.test.ts'],
  extensions: ['ts', 'js'],
  require: ['ts-node/register', 'tsconfig-paths/register', 'dotenv/config'],
  environmentVariables: {
    PROJECT_ID: '117k4j1uvi',
    REST_DOMAIN: 'api.retter.io',
    STAGE: 'test',
    WEB_DOMAIN: 'api.retter.io',
    ORDER_DESTINATION_API_KEY: 'test',
    WEB_SITE_URL: 'https://test.dolumarket.com',
    AWS_SES_ACCESSKEY: 'keyid',
    AWS_SES_SECRETKEY: 'key',
    AWS_SES_REGION: 'istanbul',
    BILLING_API_KEY: 'fakeKey',
  },
}
