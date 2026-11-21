const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 200 ,
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports=corsOptions
