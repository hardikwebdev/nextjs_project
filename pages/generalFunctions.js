// SubText.js
const SubText = (data) => {
    try {
        const jsonString = JSON.stringify(data); // Ensure data is a JSON string
        const jsonData = JSON.parse(jsonString);
        const homeBlockConfigurationSubText = jsonData?.blocks.map((block) => block.text);
        return homeBlockConfigurationSubText;
    } catch (error) {
        console.log("error", error);
        return null; // Handle the error gracefully, returning null for example
    }
};

export { SubText }; // Named export

// VideoComponent.js
import React, { useState } from 'react';

const VideoComponent = ({ videoSrc, styling, videoDuration }) => {

    return (
        <div className="position-relative savedVideoDataWidth">
            <img width="100%" className={`h-100 ${styling}`} src={videoSrc}></img>
            {videoDuration && (
                <div className="video-duration-overlay">
                    {videoDuration}
                </div>
            )}
        </div>
    );
};

export default VideoComponent; // Default export

