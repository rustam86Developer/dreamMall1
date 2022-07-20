const config = {
    /**
     * Emails
     */

    EMAIL: {
        CUSTOMER_SUCCESS: 'aasif@getnada.com',
        ERROR: 'agami.test005@gmail.com',
        TEST_EMAIL: "agami.test005@gmail.com",
        CC_EMAIL: 'agami.test001@gmail.com',
        VERSE_ADMIN: 'agami.test001@gmail.com',
        ONBOARDING_EMAIL: ['aasifkhan@getnada.com', 'anjali@getnada.com']
    },

    /**
     * The configuration items for Amazon Web Services (AWS).
     */
    AWS: {
        BUCKET_NAME: 'stikkum',
        BASE_URL: 'https://stikkum.s3-us-west-2.amazonaws.com/',
        ACCESS_KEY_ID: 'AKIA243FE7FAWFEQDOR3',
        SECRET_ACCESS_KEY: '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',
    },

    /**
     * The application server's base url
     */
    SERVER_BASE_URL: 'http://localhost/',

    /**
     * SMS credentials for twilio.
     */
    TWILIO: {
        ACCOUNT_SID: 'ACe266a32f8a3ceec0d136c0e3ba8c223e',
        AUTH_TOKEN: '1ba7ee4c1f72b0cfa656969c1518b076',
        SENDER_NUMBER: '+15612933408'
    },

    /**
     * SMTP configuration for mail services
     */
    SMTP: {
        SENDER: 'stktest@agamitechnologies.email',
        CREDENTIALS: {
            host: 'smtp.gmail.com',//'smtp.gmail.com',//agamitechnologies.email
            port: 587,
            auth: {
                // user: 'stktest@agamitechnologies.email',
                // pass: 'stk@@234',
                user: 'mohdaquibagami@gmail.com',
                pass: '786shavez',
            }
        }
    },

    /**
     * Credentials for velox payment gateway
     */

    VELOX: {
        USERNAME: 'JeffLondres',
        PASSWORD: 'Stikkum@2019',
        URL: 'https://velox.transactiongateway.com/api/transact.php'
    },

    COMPLYTRAQ: {
        URL: '  http://localhost:3600/site-inspection-data',
        METHOD: 'POST'
    },
    /**
     * Host for swagger api
     */
    SWAGGER_HOST: 'localhost/core',

    /**
     * S3 Paths
     */

    S3_URL: 'https://stikkum.s3-us-west-2.amazonaws.com/',
    SERVER_ENROLLMENT_BACKUP: '/var/www/Stikkum/server/temporary/enrollment',
    SERVER_UPLOAD_TEMP: '/var/www/Stikkum/server/temporary/upload/',
    PARTNER_PROFILE_IMAGE: 'Partners/Images/ProfilePicture/',
    PARTNER_LOGO_IMAGE: 'Partners/Images/Logo/',
    PARTNER_DOCUMENT: 'Partners/Documents/',
    USER_PROFILE_PIC_PATH: 'Clients/Images/ProfilePicture/',
    ENROLLMENT_SERVICE_AGREEMENT: 'Clients/ServiceAgreement/enrollmentServiceAgreement.txt',
    EMAIL_LOGS: 'Logs/Email/',
    TEMPLATES: 'Templates/',
    COMPLAYTRAQ_DOCUMENT: 'Jobs/ComplyTraq/Receive/',
    ENROLLMENT_DOCUMENT: 'Clients/EnrollmentDocuments/',
    HELP_VIDEO: 'Help/Videos/',
    HELP_DOCUMENT: 'Help/Documents/',
    VIDEO: 'Clients/Videos/',
    GIF: 'Clients/Gif/',


    //SES Dev
    AWS_SES_HOST: 'email-smtp.us-east-1.amazonaws.com',
    AWS_SES_SENDER: 'engage@agamitechnologies.in',
    AWS_SES_PORT: 587,
    AWS_SES_AUTH_EMAIL: 'AKIAVSIS7MI3AE2JJJDQ',
    AWS_SES_AUTH_PASSWORD: 'BERKyBlgV1MIP8T4qcQNJS95588jnjZt3iWeOZcdKJOo',

    // SES prod
    // AWS_SES_HOST: 'email-smtp.us-east-1.amazonaws.com',
    // AWS_SES_SENDER: 'Stikkum Engage <no-reply@stikkumcommunication.com>',
    // AWS_SES_PORT: 587,
    // AWS_SES_AUTH_PASSWORD: 'BG+Gx32uo6TrCbIfipbc6xxpJrIkyBJP71zik3YdoVXt',
    // AWS_SES_AUTH_EMAIL: 'AKIAUXXM7YQHM6NNDGD4',

    // For template related key DEV
    AWS_SES_TEMPLATE_SECRET_KEY: 'sh5ASujmWCirPxzXlKgGjjBnsVwD5agF84cPTFJI',//'cZ1BctYYZ7Hp4VjoCNz8ema45si+hU7HKwBqZQyX',
    AWS_SES_TEMPLATE_ACCESS_KEY: 'AKIAVSIS7MI3OTD3DNVK',//'AKIAVSIS7MI3CUJMEOIO',
    AWS_SES_REGION: 'us-east-1',

    // prod working config
    // AWS_SES_TEMPLATE_SECRET_KEY: '/WPINoA+wwUgW6OY0xIh3N0Nd5GW7spXgm5Gz5rH',
    // AWS_SES_TEMPLATE_ACCESS_KEY: 'AKIAUXXM7YQHCWJSBMMQ',
    // AWS_SES_REGION: 'us-east-1',

    /**
     * JOBS
     */
    JOBS_SERVER_BASE_URL: 'http://localhost:3600/'


}
module.exports = config;