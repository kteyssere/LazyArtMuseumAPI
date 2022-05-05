require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const exhibitionRouter = require('./routes/exhibition.router');
//const planetRouter = require('./routes/planet.router');
const app = express();
// const auth = require('./auth');
const auth = require("./auth");
const User = require('./model/user.model');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.DB_CONNECTION)
.then((res) => console.log('Connected to database'))
.then((res) => app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
}))
.catch((err) => console.log(err));

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Lazy Art Museum API',
            description: 'Lazy Art Museum API Information',
            contact: {
                name: 'John'
            },
            servers: ['https://localhost:5000']
        }
    },
    apis: ["index.js"]
};
/**
 * @swagger
 * /exhibitions:
 *  get:
 *      description: Use to get a list of all exhibitions
 *      responses:
 *          '200':
 *              description: Success
 */
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors({
    origin: '*'
}))
app.use((req, res, next) => {
    const start = Date.now();
    next();
    const delta = Date.now() - start;
    console.log(`Method: ${req.method}\nUrl: ${req.baseUrl}${req.url}\nTime: ${delta}ms\n`);
});
app.use(express.json());

// app.post('/login', (req, res) => {
//     User.findOne({name: req.body.name, password: req.body.name})
//     .then((result => {
//         const userobj = {name: req.body.name};
//         const token = jwt.sign(userobj, process.env.SECRET_TOKEN);
//         res.json({acessToken: token});
//     })).catch((err) => {res.send(err)})
// });
// Register
app.post("/signup", async (req, res) => {
console.log("r");
    // Our register logic starts here
    let encryptedPassword;
    try {
        // Get user input
        const {name, email, password} = req.body;

        // Validate user input
        if (!(email && password && name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        console.log(password);
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});
// app.get("/logout",(req,res)=>{
//     req.logout();
//     res.redirect("/");
// });

app.get('/', (req, res) => { res.send('Welcome to my web server'); });
app.use('/exhibitions', exhibitionRouter);
