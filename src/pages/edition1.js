import { connectToDatabase } from "../../util/mongodb";
import { useState } from "react";
export default function Edition1({teams}) {

  let [team1,...initialTeams2]=teams;
  const [teams2, setTeams2] = useState([...initialTeams2]);
  const [addGameButtonIsToggled, setAddGameButtonIsToggled] = useState(false);
  const [lastGames, setLastGames]= useState([]);
  const [loadedGames, setLoadedGames]= useState(false);
  const [updatedTeams, setUpdatedTeams]= useState(teams);
  const [addGameButton, setAddGameButton] = useState(<button className="submit-button" type="submit">Add Game</button>);

  if (loadedGames===false){
    getLastGames();
    setLoadedGames(true);
  }

  function handleTeam1Change(e){
    team1 = teams.find(team=> (team.element1+"/"+team.element2) === e.target.value);
    setTeams2(teams.filter(team => team.teamId !== team1.teamId));
  }

  
  async function updateScores(team1,team2,team1Score,team2Score){
    
    const teamsUpdated = await fetch("https://mindswap-padel.vercel.app/api/edition1", {
      method: "GET",
    });
    const teamsUpdatedJson = await teamsUpdated.json();
    
    team1 = teamsUpdatedJson.find(team => team.teamId === team1.teamId);
    team2 = teamsUpdatedJson.find(team => team.teamId === team2.teamId);

    let result = [team2, team1];

    if (team1Score>team2Score){
      result = [team1, team2];
    }

    const winner = result[0]
    const loser = result[1];

    result.push(winner.points+3);
    result.push(loser.points);
    result.push(winner.wins+1);
    result.push(loser.wins);
    result.push(winner.losses);
    result.push(loser.losses+1);
    
    return result;
  }

    async function newGameSubmit(e) {
       
      e.preventDefault();

      setAddGameButton(<button className="submit-button" disable={true}>Add Game</button>)
      
      const form = e.target;
      const team1Input = form.elements.namedItem("team1");
      const team1players = team1Input.value;
      const team1 = teams.find(team=> (team.element1+"/"+team.element2) === team1players);
      const team2Input = form.elements.namedItem("team2");
      const team2players = team2Input.value;
      const team2 = teams.find(team=> (team.element1+"/"+team.element2) === team2players);
      const team1ScoreInput = form.elements.namedItem("team1-score");
      const team1Score = team1ScoreInput.value;
      const team2ScoreInput = form.elements.namedItem("team2-score");
      const team2Score = team2ScoreInput.value;

      if (team1Score === team2Score){
        console.log("ties are not allowed");
        return;
      }

      const winner_loser_updated_scores = await updateScores(team1,team2,team1Score,team2Score)
    
      const game = {
        edition:1,
        team1: team1.teamId,
        score1: team1Score,
        team2: team2.teamId,
        score2: team2Score,
      }

       const winnerTeamObject = {
         teamId: winner_loser_updated_scores[0].teamId,
         points: winner_loser_updated_scores[2],
         wins: winner_loser_updated_scores[4],
         losses: winner_loser_updated_scores[6]
       }

      const loserTeamObject = {
        teamId: winner_loser_updated_scores[1].teamId,
        points: winner_loser_updated_scores[3],
        wins: winner_loser_updated_scores[5],
        losses: winner_loser_updated_scores[7]
      }
      
      const response1 = await fetch("https://mindswap-padel.vercel.app/api/edition1", {
        method: "POST",
        body: JSON.stringify(game),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });

      await fetch("https://mindswap-padel.vercel.app/api/edition1", {
        method: "PUT",
        body: JSON.stringify(winnerTeamObject),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });

      await fetch("https://mindswap-padel.vercel.app/api/edition1", {
        method: "PUT",
        body: JSON.stringify(loserTeamObject),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });

      const teamsUpdated = await fetch("https://mindswap-padel.vercel.app/api/edition1", {
        method: "GET",
      });

      const teamsUpdatedJson = await teamsUpdated.json();

      setAddGameButtonIsToggled(false);
      getLastGames()
      setUpdatedTeams(teamsUpdatedJson)
    }

    async function getLastGames(){
      const lastGames = await fetch("https://mindswap-padel.vercel.app/api/edition1", {
        method: "PUT",
        body: JSON.stringify({collection:"games"}),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });
      
      const lastGamesJson = await lastGames.json();

      setLastGames(lastGamesJson);
    }

    

    function Game(props){
      const{team1Id, team2Id, score1, score2} = props;

      const team1 = teams.find(team=> team.teamId === team1Id);
      const team2 = teams.find(team=> team.teamId === team2Id);
      
      return <li className="game-result" key={Date.now()}>
        <article className="team-result">
          
							<span className="result-player">{team1.element1}</span>
							<span className="result-player">{team1.element2}</span>
							<span className="result-score">{score1}</span>
              
						</article>
            <article className="team-result">
          
							<span className="result-player">{team2.element1}</span>
							<span className="result-player">{team2.element2}</span>
							<span className="result-score">{score2}</span>
              
						</article>

      </li>
    }
  
    
    
  return (
  <>
    <header className="general-header">
      <span className="firt-part-header">
        <img className="logo-header" 
        src="data:image/png;base64,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" />
        <h2 className="padel-logo">PADEL</h2>
      </span>
      <nav className="a-header">
        <a className="a-header-clickable" href="/">Home</a>
        <a><b>Edition 1</b></a>
      </nav>
    </header>

    <main className="main-edition">
    <div className="add-new-game-feature">

    {addGameButtonIsToggled ? <form className="add-new-game-form" onSubmit={newGameSubmit}>
    <div className="input">
    <label>Team 1:</label>

    <select name="team1" id="team1-select" onChange={handleTeam1Change}>
      {teams.map(team => <option key={team.teamId}>{team.element1}/{team.element2}</option>) }   
    </select>
    <input name="team1-score" placeholder="0"  type="number" min="0" max="3" required />
    </div>
  <div className="input">
    <label>Team 2:</label>
    <select name="team2" id="team2-select">
      {teams2.map(team => <option key={team.teamId}>{team.element1}/{team.element2}</option>) }   
    </select>
    <input name="team2-score" placeholder="0"  type="number" min="0" max="3" required />
    </div>
      {addGameButton}
    </form> : <button className="add-new-game-button" onClick={()=>setAddGameButtonIsToggled(true)}>Add New Game</button>}
    </div>
    <div className="last-games">
      <h1>Last Games</h1>
      <ul>
        {lastGames.map(game=> <Game team1Id={game.team1} team2Id={game.team2} score1={game.score1} score2={game.score2}/>)}
      </ul>
      </div>

      <ol className="edition-champions-table">
      <h1>Edition 1 Champions</h1>
      <header className="pos-header">
							<h2 className="edition-table-header-1" >Players</h2>
							<h2 className="edition-table-header">P</h2>
              <h2 className="edition-table-header" >W</h2>
							<h2 className="edition-table-header">L</h2>
						</header>
            
          {updatedTeams.map((team) => (
          <li className="team" key={team.teamId}>
             <article className="team-pos">
						  	<h3 className="edition-table-td-1">{team.element1 +"/"+team.element2}</h3>
							  <h3 className="edition-table-td">{team.points}</h3>
							  <h3 className="edition-table-td">{team.wins}</h3>
							  <h3 className="edition-table-td">{team.losses}</h3>
						  </article>
            </li> 
          ))}
          
      </ol>
      </main>
      </>
  );
}
export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const teams = await db
    .collection("editions")
    .find({"edition": 1})
    .sort({points: -1, losses: 1})
    .toArray();
  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
}