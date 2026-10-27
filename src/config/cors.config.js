const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allows cookies or authorization headers
    optionsSuccessStatus: 200 ,
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports=corsOptions
