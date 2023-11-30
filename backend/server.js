require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
const port = 3000;

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

// Route to authenticate with YouTube
app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/youtube'
  });
  res.send(`<a href="${url}">Authenticate with YouTube</a>`);
});

let userTokens = {};

app.get('/oauth2callback', async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    
    // Store tokens in your storage system
    userTokens = tokens;

    res.send('Authentication successful! You can now close this page.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during authentication');
  }
});

// Add a video to a playlist
app.post('/addToPlaylist', async (req, res) => {
  if (!userTokens || !userTokens.access_token) {
    return res.status(401).send('No valid access token. Please re-authenticate.');
  }
  oauth2Client.setCredentials(userTokens);
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  try {
    const response = await youtube.playlistItems.insert({
      part: 'snippet',
      resource: {
        snippet: {
          playlistId: 'PLCdTh-9dCJtgB1s9fRXw-fMKy60OIUkc7', // Replace with your playlist ID
          resourceId: {
            kind: 'youtube#video',
            videoId: req.query.videoId // Video ID from the request
          }
        }
      }
    });
    res.send('Video added to playlist!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding video to playlist');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
