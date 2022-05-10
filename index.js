require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exhibitionRouter = require('./routes/exhibition.router');
const userRouter = require('./routes/user.router');
const app = express();
const User = require('./model/user.model');
const Exhibition = require('./model/exhibition.model');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 8000;
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const qr = require("qrcode");

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

// Register
app.post("/signup", async (req, res) => {

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

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            roles: "user"
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
app.post("/plogin", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        // if (!(email && password)) {
        //     res.status(400).send("All input is required");
        // }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user !== null && (await bcrypt.compare(password, user.password))) {
            // user
            res.status(200).json(user);
        }else{
            res.send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }

});

app.post("/buytickets", async (req, res) => {

    try {
    const { exhibitionId, respform} = req.body;

    //const user = await User.findOne({ usrMail });
    const exhibition = await Exhibition.findOne({exhibitionId});

    //const url = "www.google.fr";

    // If the input is null return "Empty Data" error
    //if (url.length === 0) res.send("Empty Data!");

    // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
    // It shall be returned as a png image format
    // In case of an error, it will save the error inside the "err" variable and display it
    const doc = new PDFDocument();

    doc.fontSize(24).text('LazyArt Museum', 100, 100);
    doc.fontSize(18).text(`${respform.firstname} ${respform.lastname}`, 100, 200);
    doc.fontSize(14).text(`Number of -26yo person : ${respform.ticketLess26}`, 100, 210);
    doc.fontSize(14).text(`Number of +/=26yo person : ${respform.ticketOver26}`, 100, 215);
    doc.fontSize(18).text(`Exhibition ${exhibition.name}`, 100, 225);
    doc.fontSize(18).text(`By ${exhibition.artist}`, 100, 230);


    //const priceOver26 = req.body.usr.ticketOver26 * 8;

    const finalPrice = req.body.respform.ticketOver26 * 8;
    doc.fontSize(21).text(`Final price : ${finalPrice}€`, 100, 500);
    doc.fontSize(14).text(`You will pay at the museum`, 100, 510);

    // qr.toDataURL(url, (err, src) => {
    //     if (err) res.send("Error occured");
    //
    //     // Let us return the QR code image as our response and set it to be the source used in the webpage
    //     // doc.image(src, {
    //     //     //fit: [300, 300],
    //     //     align: 'center',
    //     //     valign: 'center'
    //     // });
    //     //res.render("scan", { src });
    // });

    doc.end();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lazyartmuseum@gmail.com',
            pass: 'hvvyrubfsxuqzsdl'
        }
    });

    const mailOptions = {
        from: 'lazyartmuseum@gmail.com',
        to: respform.mail,
        subject: `Your ticket for the ${exhibition.name} exhibition`,
        text: `Hello ${respform.firstname} ! There is your ticket for the ${exhibition.name} exhibition.
        You will have to pay in the museum.`,
        attachments: [{
            filename: `ticket${exhibition.name}exhibition${respform.lastname}.pdf`,
            content: doc,
        }],
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200);
        }
    });

    } catch (err) {
        console.log(err);
    }

});

app.get('/', (req, res) => { res.send('Welcome to my web server'); });
app.use('/exhibitions', exhibitionRouter);
app.use('/users', userRouter);
