function searchMusic() {
    let query = document.getElementById('search-query').value;
    let apiKey = 'AIzaSyBndYbeeF0lIu5y6d71WHW_fGek63c1_oQ'; // Replace with your actual YouTube API key

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        }).catch(error => {
            console.error('Error:', error);
        });
}

function displayResults(videos) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    videos.forEach(video => {
        let videoElement = document.createElement('div');
        videoElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
            <p>${video.snippet.description}</p>
            <button onclick="addToPlaylist('${video.id.videoId}')">Add to Playlist</button>
        `;
        resultsDiv.appendChild(videoElement);
    });
}


function addToPlaylist(videoId) {
    fetch(`http://localhost:3000/addToPlaylist?videoId=${videoId}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // Display success message to user
        alert("Video successfully added to playlist!");
    }).catch(error => {
        // Display error message to user
        alert("Error adding video to playlist: " + error.message);
    });
}


