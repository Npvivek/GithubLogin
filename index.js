const axios = require("axios");
const express = require("express");
const cors = require('cors');
const path = require("path");
const app = express();
const PORT = 8000;


app.use(cors());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/auth", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=2e63a9cb2528d488121b&scope=user:email`);
})

app.get("/callback", async (req, res) => {
    try {
        const response = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: "2e63a9cb2528d488121b",
            client_secret: "016c4fedd4f952e32f4433ec78a1a0e65fbbb3f2",
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
        console.log(userProfile.data);

        res.send(userProfile.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, '192.168.0.107', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});