package docinput

import (
	"log"
	"syncvote/utils"
	"syncvote/voteconstants"
)

type DocInput struct {
	Options      []string `json:"options"`
	Max          int      `json:"max"`
	noOfChildren int
	isOutput     bool
	result       int
}

func (this *DocInput) Init(data interface{}, isOuput bool, noOfChildren int) {
}

func (this *DocInput) Start(from voteconstants.VoteMachineType, seed interface{}) {
	this.result = -1
}

func (this *DocInput) Vote(who string, userSelectedOptions []interface{}) {
	if this.result == -1 {
	}
}

func (this *DocInput) IsValidChoice(who string, userSelectedOptions []interface{}) bool {
	idx := utils.InterfaceToInt(userSelectedOptions[0])
	if idx < this.noOfChildren {
		return true
	}
	return false
}

func (this *DocInput) GetTallyResult() (voteconstants.VoteMachineType, int, interface{}) {
	// return voteconstants.VM_SingleChoiceRaceToMax, this.result, this.voted
}

func (this *DocInput) GetCurrentVoteState() interface{} {
	log.Println("GetCurrentVoteState: ", this.voted)
	return this.voted
}

func (this *DocInput) GetChoices() interface{} {
	return this.Options
}