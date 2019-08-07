function register(voxaApp) {
    function getObjecToState(flow, reply){
        return {
            flow,
            reply
        }
    }

    voxaApp.onIntent("CancelIntent", () => {
        return getObjecToState("terminate","Bye");
      });
    
      voxaApp.onIntent("StopIntent", () => {
        return getObjecToState("terminate","Bye");
      });
}

module.exports = register;