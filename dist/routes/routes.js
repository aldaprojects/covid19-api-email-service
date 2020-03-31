"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controller/country_controller"));
const router = express_1.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.covidreports@gmail.com',
        pass: 'covidreports11'
    }
});
router.get('/cases', (req, res) => {
    controller.getLatestCases((err, cases) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        return res.status(200).json({
            ok: true,
            cases
        });
    });
});
router.get('/visitas', (req, res) => {
    return res.status(200).json({
        ok: true,
        visitas: process.env.VISITAS
    });
});
router.post('/soport', (req, res) => {
    const email = req.body.email;
    const msg = req.body.msg;
    let msgconfig = configEmail(email, msg);
    sendEmail(msgconfig);
    return res.status(200).json({
        ok: true
    });
});
router.get('/allcountries', (req, res) => {
    controller.getAllCountriesName((err, countries) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        return res.status(200).json({
            ok: true,
            countries
        });
    });
});
router.get('/countries', (req, res) => {
    controller.getAllCountries((err, countries) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        return res.status(200).json({
            ok: true,
            countries
        });
    });
});
router.get('/country', (req, res) => {
    let name = req.query.name;
    controller.getOneCountry(name, (err, country) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        return res.status(200).json({
            ok: true,
            country
        });
    });
});
router.post('/subscription', (req, res) => {
    let email = req.body.email;
    let country = req.body.country;
    controller.getOneCountry(country, (err, country) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        for (let i = 0; i < country.subscriptions.length; i++) {
            if (email === country.subscriptions[i]) {
                return res.json({
                    ok: false,
                    message: 'Email ya en uso'
                });
            }
        }
        country.subscriptions.push(email);
        country.save((err, country) => {
            if (err) {
                return res.json({ ok: false, err });
            }
            return res.status(200).json({
                ok: true,
                email
            });
        });
    });
});
router.post('/subscription/cancel', (req, res) => {
    let token = req.body.token;
    jwt.verify(token, 'seed', (err, decoded) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        controller.getOneCountry(decoded.country, (err, country) => {
            if (err) {
                return res.json({ ok: false, message: 'Algo salió mal. La url no es correcta.' });
            }
            for (let i = 0; i < country.subscriptions.length; i++) {
                if (decoded.email === country.subscriptions[i]) {
                    country.subscriptions.splice(i, 1);
                }
            }
            country.save((err, country) => {
                if (err) {
                    return res.json({ ok: false, err });
                }
                return res.status(200).json({
                    ok: true,
                    message: 'ok, unsubscribe'
                });
            });
        });
    });
});
router.get('/global', (req, res) => {
    controller.getGlobalCases((err, global) => {
        if (err) {
            return res.json({ ok: false, err });
        }
        return res.status(200).json({
            ok: true,
            global
        });
    });
});
function configEmail(email, msg) {
    const mailOptions = {
        from: 'noreply.sectec@gmail.com',
        to: 'aldaprojects@hotmail.com',
        subject: `NEW REPORT ABOUT SOPORT FROM ${email}`,
        html: `
           <p> ${msg} </p>
        `
    };
    return mailOptions;
}
function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.default = router;
