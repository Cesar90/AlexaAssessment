const CHOICES = ["rock", "paper", "scissors"];

function register(voxaApp) {

  function getObjecToState(flow, reply, to){
    return {
        flow,
        reply,
        to
    }
}

  voxaApp.onIntent("LaunchIntent", () => {
    return getObjecToState("continue","Welcome","askHowManyWins");
  });

  voxaApp.onState("askHowManyWins", () => {
    return getObjecToState("yield","AskHowManyWins","getHowManyWins");
  });

  voxaApp.onState("getHowManyWins", voxaEvent => {
    if (voxaEvent.intent.name === "MaxWinsIntent") {
      voxaEvent.model.wins = voxaEvent.intent.params.wins;
      voxaEvent.model.userWins = 0;
      voxaEvent.model.alexaWins = 0;

      if(voxaEvent.model.wins > 10){
        return getObjecToState("continue","numberBiggerToPlay","askIfNumberIsBiggerOrContinuePlay");
      }

      return getObjecToState("continue","StartGame","askUserChoice");
    }
  });

  voxaApp.onState("askIfNumberIsBiggerOrContinuePlay", () => {
    return {
      flow: "yield",
      to: "shouldNumberIsBiggerOrContinuePlay",
    };
  });

  voxaApp.onState("shouldNumberIsBiggerOrContinuePlay", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return getObjecToState("continue","ContinuePlaying","askUserChoice");
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return getObjecToState("continue","ContinuePlaying","askHowManyWins");
    }
  });

  voxaApp.onState("askUserChoice", voxaEvent => {
    const userWon = parseInt(voxaEvent.model.userWins) >= parseInt(voxaEvent.model.wins);
    const alexaWon = parseInt(voxaEvent.model.alexaWins) >= parseInt(voxaEvent.model.wins);

    if (userWon) {
      return getObjecToState("continue","UserWinsTheGame","askIfStartANewGame");
    }

    if (alexaWon) {
      return getObjecToState("continue","AlexaWinsTheGame","askIfStartANewGame");
    }

    const min = 0;
    const max = CHOICES.length - 1;
    voxaEvent.model.userChoice = undefined;
    voxaEvent.model.alexaChoice = Math.floor(Math.random() * (max - min + 1)) + min;

    return getObjecToState("yield","AskUserChoice","getUserChoice");
  });

  voxaApp.onState("getUserChoice", voxaEvent => {

    if (voxaEvent.intent.name === "RockIntent") {
      voxaEvent.model.userChoice = "rock";
    }

    if (voxaEvent.intent.name === "PaperIntent") {
      voxaEvent.model.userChoice = "paper";
    }

    if (voxaEvent.intent.name === "ScissorsIntent") {
      voxaEvent.model.userChoice = "scissors";
    }

    if (voxaEvent.model.userChoice) {
      return {
        flow: "continue",
        to: "processWinner",
      };
    }
  });

  voxaApp.onState("processWinner", voxaEvent => {
    const alexaChoice = CHOICES[voxaEvent.model.alexaChoice];
    const { userChoice } = voxaEvent.model;
    let reply = "TiedResult";

    if (alexaChoice === userChoice) {
      return {
        flow: "continue",
        reply,
        to: "askUserChoice",
      };
    }

    if (alexaChoice === "rock") {
      if (userChoice === "paper") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "scissors") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "paper") {
      if (userChoice === "scissors") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "rock") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    if (alexaChoice === "scissors") {
      if (userChoice === "rock") {
        voxaEvent.model.userWins += 1;
        reply = "UserWins";
      }

      if (userChoice === "paper") {
        voxaEvent.model.alexaWins += 1;
        reply = "AlexaWins";
      }
    }

    return {
      flow: "continue",
      reply,
      to: "askUserChoice",
    };
  });

  voxaApp.onState("askIfStartANewGame", () => {
    return getObjecToState("yield","AskIfStartANewGame","shouldStartANewGame");
  });

  voxaApp.onState("shouldStartANewGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return getObjecToState("continue","RestartGame","askHowManyWins");
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });

  voxaApp.onIntent("NewGameIntent", voxaEvent => {
    let alexaWins = voxaEvent.model.alexaWins || 0;
    let userWins = voxaEvent.model.userWins || 0;

    if(alexaWins == 1 && !userWins){
      return getObjecToState("continue","alexaIsWinnigWithOne","askIfStartANewGameOrContinue");
    }
  });

  voxaApp.onState("askIfStartANewGameOrContinue", () => {
    return {
      flow: "yield",
      reply,
      to: "shouldContinueGameOrContinue",
    };
  });

  voxaApp.onState("shouldContinueGameOrContinue", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return getObjecToState("continue","RestartGame","askHowManyWins");
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return getObjecToState("continue","ContinuePlaying","askUserChoice");
    }
  });

  voxaApp.onIntent("ScoreIntent", voxaEvent => {
    return {
      flow: "continue",
      to: "checkCurrentScore",
    };
  });

  voxaApp.onIntent("HelpIntent", () => {
    return getObjecToState("continue","help","checkCurrentScore");
  });

  voxaApp.onIntent("FallbackIntent", () => {
    return getObjecToState("continue","fallback","checkCurrentScore");
  });

  voxaApp.onState("checkCurrentScore", voxaEvent => {
    if(!voxaEvent.model.userWins && 
      !voxaEvent.model.alexaWins){
       return getObjecToState("continue","thereisnotscore","askIfStartANewGame");
    }
    return getObjecToState("continue","thereisscore","askIfContinueGame");
  });

  voxaApp.onState("askIfContinueGame", () => {
    return getObjecToState("yield","askIfContinueGame","shouldContinueGame");
  });

  voxaApp.onState("shouldContinueGame", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return getObjecToState("continue","ContinuePlaying","askUserChoice");
    }

    if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "terminate",
        reply: "Bye",
      };
    }
  });
}

module.exports = register;