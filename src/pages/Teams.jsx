import React from 'react';

const teamsData = [
    {
        logo: 'team1_logo_url',
        captain: 'Captain Name 1',
        players: [
            { name: 'Player 1', photo: 'player1_photo_url', details: 'Details about Player 1' },
            // Add more players here up to 15
        ]
    },
    {
        logo: 'team2_logo_url',
        captain: 'Captain Name 2',
        players: [
            { name: 'Player 1', photo: 'player1_photo_url', details: 'Details about Player 1' },
            // Add more players here up to 15
        ]
    },
    // Add more teams here
];

const Teams = () => {
    return (
        <div className="teams-container">
            {teamsData.map((team, index) => (
                <div key={index} className="team-card">
                    <img src={team.logo} alt={`Logo of ${team.captain}`} className="team-logo" />
                    <h2>{team.captain}</h2>
                    <h3>Players:</h3>
                    <ul>
                        {team.players.map((player, idx) => (
                            <li key={idx} className="player">
                                <img src={player.photo} alt={`Photo of ${player.name}`} className="player-photo" />
                                <p><strong>{player.name}</strong></p>
                                <p>{player.details}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Teams;
