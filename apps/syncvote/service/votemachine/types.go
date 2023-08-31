package votemachine

import (
	"syncvote/voteconstants"
	"singlevote/singlechoiceracetomax"
	"polling/multichoiceraccetomax"
)

type VoteMachineInterface interface {
	Init(data interface{}, isOutput bool, noOfChildren int)
	Start(from voteconstants.VoteMachineType, seed interface{})
	IsValidChoice(who string, userSelectedOptions []interface{}) bool
	Vote(who string, userSelectedOptions []interface{})
	GetChoices() interface{}
	GetTallyResult() (machineType voteconstants.VoteMachineType, nextChildId int, votedResult interface{})
	GetCurrentVoteState() interface{}
}

type RequiredVoteData struct {
	StartAfter int `json:"start_after"` // timestamp; start after CheckPoint start
	EndBefore  int `json:"end_before"`  // length in second; must > 1 min in production
}

func BuildVoteMachine(machineType voteconstants.VoteMachineType, data interface{}, isOutput bool, noOfChildren int) VoteMachineInterface {
	switch machineType {
	case voteconstants.VM_SingleChoiceRaceToMax:
		tmp := &singlechoiceracetomax.SingleChoiceRaceToMax{}
		tmp.Init(data, isOutput, noOfChildren)
		return tmp
	case voteconstants.VM_MultipleChoiceRaceToMax:
		return &multichoiceraccetomax.MultipleChoiceRaceToMax{}
	}
	return nil
}