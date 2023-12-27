require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require('cors');
const path = require("path");


const app = express();
const PORT = 8000;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;


app.use(cors());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/auth", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`);
})

app.get("/callback", async (req, res) => {
    try {
        const response = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: githubClientId,
            client_secret: githubClientSecret,
            code: req.query.code
        }, {
            headers: {
                Accept: "application/json"
            }
        });

        const accessToken = response.data.access_token;

        // Use access token to fetch user info
        const userProfile = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "Scimics", // Replace with your app name
            },
        });

        const userData = {
            username: userProfile.data.login,
            avatarUrl: userProfile.data.avatar_url,
            // Add more fields as needed
        };

        // You can now use the 'userData' object as per your requirements
        console.log(userProfile);
        res.send(userProfile.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, '192.168.0.107', () => {
    console.log(`Server is running on http://192.168.0.107:${PORT}`);
});