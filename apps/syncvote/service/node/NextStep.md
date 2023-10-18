# Next Step


// Split web2 and web3 part

// Change the way construct code, endpoint is vote machine

// Every votemachine have 

// add initData to initDataForCVD

isAllCheckPointValid = true
for (var i=0;i<checkpoints.length;i++) {
  vm = getVoteMachine(checkpoints[i].voteMachineType);
  const {quorum, title, description} = checkpoints[i]
  const {isValid} = vm.validate(checkpoints[i])
  if (quorum && title && description && isValid){
    continue
  }else{
    isAllCheckPointValid = false
  }
}
// isAllCheckPointValid