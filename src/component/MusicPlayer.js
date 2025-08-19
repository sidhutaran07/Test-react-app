import React from 'react';
import YouTube from 'react-youtube';

const MusicPlayer = () => {
  // The ID of the YouTube playlist you want to play
  const playlistId = 'PL4fGSI1pDJn6j_g_2tQo1_V9orUu_i_p_';

  // Options for the YouTube player
  const opts = {
    height: '390',
    width: '100%', // Make it responsive
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // 0 = no autoplay, 1 = autoplay
      listType: 'playlist',
      list: playlistId,
    },
  };

  const onReady = (event) => {
    // access to player in all event handlers via event.target
    // for example, you could play the video here
    // event.target.playVideo();
    console.log('YouTube player is ready.');
  };

  return (
    <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
      <h3>Ambient Music Playlist 🎵</h3>
      <YouTube
        opts={opts}
        onReady={onReady}
        style={{ maxWidth: '640px', margin: '0 auto' }}
      />
    </div>
  );
};

export default MusicPlayer;
