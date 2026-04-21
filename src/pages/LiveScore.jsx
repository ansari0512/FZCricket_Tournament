import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://your-socket-server-url');

const LiveScore = () => {
    const [scoreData, setScoreData] = useState({
        currentBatsman: '',
        currentBowler: '',
        runs: 0,
        wickets: 0,
        overs: 0,
        runRate: 0,
    });

    useEffect(() => {
        socket.on('scoreUpdate', (data) => {
            setScoreData(data);
        });

        return () => {
            socket.off('scoreUpdate');
        };
    }, []);

    return (
        <div>
            <h1>Live Score</h1>
            <p>Current Batsman: {scoreData.currentBatsman}</p>
            <p>Current Bowler: {scoreData.currentBowler}</p>
            <p>Runs: {scoreData.runs}</p>
            <p>Wickets: {scoreData.wickets}</p>
            <p>Overs: {scoreData.overs}</p>
            <p>Run Rate: {scoreData.runRate}</p>
        </div>
    );
};

export default LiveScore;