import React from 'react';

const Schedule = () => {
    const matches = [
        {
            date: '2026-05-01',
            teams: ['Team A vs Team B'],
            type: 'Group',
            overs: 20,
            venue: 'Odajhar',
        },
        {
            date: '2026-05-02',
            teams: ['Team C vs Team D'],
            type: 'Group',
            overs: 20,
            venue: 'Odajhar',
        },
        {
            date: '2026-05-03',
            teams: ['Team E vs Team F'],
            type: 'Semi-Final',
            overs: 20,
            venue: 'Odajhar',
        },
        {
            date: '2026-05-04',
            teams: ['Team G vs Team H'],
            type: 'Final',
            overs: 20,
            venue: 'Odajhar',
        },
    ];

    return (
        <div>
            <h1>Tournament Schedule</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Teams</th>
                        <th>Match Type</th>
                        <th>Overs</th>
                        <th>Venue</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={index}>
                            <td>{match.date}</td>
                            <td>{match.teams.join(' & ')}</td>
                            <td>{match.type}</td>
                            <td>{match.overs}</td>
                            <td>{match.venue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Schedule;