import React from 'react';

const Home = () => {
  return (
    <div>
      <header>
        <h1>Tournament Hero Section</h1>
        <p>Welcome to the FZ Cricket Tournament!</p>
      </header>
      <section>
        <h2>Registration Status</h2>
        <p>Registration is currently open!</p>
      </section>
      <section>
        <h2>Registered Teams Preview</h2>
        <ul>
          <li>Team A</li>
          <li>Team B</li>
          <li>Team C</li>
        </ul>
      </section>
      <section>
        <h2>Upcoming Matches</h2>
        <ul>
          <li>Match 1: Team A vs Team B - April 22, 2026</li>
          <li>Match 2: Team C vs Team A - April 23, 2026</li>
        </ul>
      </section>
      <section>
        <h2>Leaderboard</h2>
        <ol>
          <li>Team A - 10 Points</li>
          <li>Team B - 8 Points</li>
          <li>Team C - 6 Points</li>
        </ol>
      </section>
    </div>
  );
};

export default Home;