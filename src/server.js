require("dotenv/config");

require("express-async-errors");

const sqliteConnection = require("./database/sqlite");

const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors");

const express = require("express");

const routes = require("./routes")

sqliteConnection();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER)); //servir arquivos

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

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))