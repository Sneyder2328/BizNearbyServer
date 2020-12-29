export const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ?[/publicURL/, /localhost/]
        :[/localhost/],
    credentials: true,
    allowedHeaders: 'Content-Type, authorization, authorization-refresh-token, X-requested-With, Accept',
    methods: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    exposedHeaders: 'authorization, authorization-refresh-token'
};