require("express-async-errors");

const sqliteConnection = require("./database/sqlite");

const AppError = require("./utils/AppError");

const express = require("express");

const routes = require("./routes")

sqliteConnection();

const app = express();
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) { //do cliente
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message 
        });
    }

    console.error(error); //para debugar 

    return response.status(500).json({ //do servidor
        status: "error",
        message: "Internal server error",
    });
});

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))