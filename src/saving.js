async function updateScores(team1,team2,team1Score,team2Score){
    
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
      
      const form = e.target;
      const team1Input = form.elements.namedItem("team1");
      const team1players = team1Input.value;
      const team1 = teams1.find(team=> (team.element1+"/"+team.element2) === team1players);
      const team2Input = form.elements.namedItem("team2");
      const team2players = team2Input.value;
      const team2 = teams1.find(team=> (team.element1+"/"+team.element2) === team2players);
      const team1ScoreInput = form.elements.namedItem("team1-score");
      const team1Score = team1ScoreInput.value;
      const team2ScoreInput = form.elements.namedItem("team2-score");
      const team2Score = team2ScoreInput.value;

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
         lossers: winner_loser_updated_scores[6]
       }

      const loserTeamObject = {
        teamId: winner_loser_updated_scores[1].teamId,
        points: winner_loser_updated_scores[3],
        wins: winner_loser_updated_scores[5],
        losses: winner_loser_updated_scores[7]
      }
      
      const response1 = await fetch("/api/edition1", {
        method: "POST",
        body: JSON.stringify(game),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });
      
      const data = await response1.json();
      console.log(data);

      await fetch("/api/edition1", {
        method: "PUT",
        body: JSON.stringify(winnerTeamObject),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });

      await fetch("/api/edition1", {
        method: "PUT",
        body: JSON.stringify(loserTeamObject),
        headers: 
        {
          "Content-Type": 
          "application/json",
        },
      });

      const newTeams = await fetch("/api/edition1", {
        method: "GET",
      });

      newTeams.json().then(newTeams => setTeams1(newTeams));

    }