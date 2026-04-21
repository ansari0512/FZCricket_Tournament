import React from 'react';
import './Results.css'; // Assume there's a CSS file for styling

const Results = () => {
    const matchResults = [
        { match: 'Team A vs Team B', result: 'Team A won by 10 runs' },
        { match: 'Team C vs Team D', result: 'Team C won by 5 wickets' },
    ];

    const leaderboard = [
        { team: 'Team A', points: 12, wins: 4, losses: 1 },
        { team: 'Team B', points: 8, wins: 2, losses: 3 },
        { team: 'Team C', points: 10, wins: 3, losses: 2 },
        { team: 'Team D', points: 6, wins: 1, losses: 4 },
    ];

    const topBatsmen = [
        { name: 'Player 1', runs: 250 },
        { name: 'Player 2', runs: 220 },
    ];

    const topBowlers = [
        { name: 'Bowler 1', wickets: 15 },
        { name: 'Bowler 2', wickets: 10 },
    ];

    return (
        <div className="results-container">
            <h2>Match Results</h2>
            <ul>
                {matchResults.map((match, index) => (
                    <li key={index}>{match.match}: {match.result}</li>
                ))}
            </ul>
            
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((team, index) => (
                        <tr key={index}> 
                            <td>{team.team}</td>
                            <td>{team.points}</td>
                            <td>{team.wins}</td>
                            <td>{team.losses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Top Batsmen</h2>
            <ul>
                {topBatsmen.map((batsman, index) => (
                    <li key={index}>{batsman.name}: {batsman.runs} runs</li>
                ))}
            </ul>

            <h2>Top Bowlers</h2>
            <ul>
                {topBowlers.map((bowler, index) => (
                    <li key={index}>{bowler.name}: {bowler.wickets} wickets</li>
                ))}
            </ul>
        </div>
    );
};

export default Results;