package singlechoiceracetomax

import (
	"fmt"
	"syncvote/utils"
	"syncvote/voteconstants"
	"log"
)

type SingleChoiceRaceToMax struct {
	Options      []string `json:"options"`
	Max          int      `json:"max"`
	voted        map[int]int
	noOfChildren int
	isOutput     bool
	result       int
}

func (this *SingleChoiceRaceToMax) Init(data interface{}, isOuput bool, noOfChildren int) {
	tmp := data.(map[string]interface{})
	options := make([]string, 0)
	max := 0
	for key, value := range tmp {
		if key == "options" {
			for _, opt := range value.([]interface{}) {
				options = append(options, opt.(string))
			}
		}
		if key == "max" {
			max = utils.InterfaceToInt(value)
		}
	}
	this.Options = options
	this.Max = max
	this.noOfChildren = noOfChildren
	this.isOutput = isOuput
}

func (this *SingleChoiceRaceToMax) Start(from voteconstants.VoteMachineType, seed interface{}) {
	this.voted = make(map[int]int)
	this.result = -1
}

func (this *SingleChoiceRaceToMax) Vote(who string, userSelectedOptions []interface{}) {
	if this.result == -1 {
		theChoice := utils.InterfaceToInt(userSelectedOptions[0])
		this.voted[theChoice] += 1
		optionName := this.Options[theChoice]
		fmt.Printf("%s vote %d [%s]. There are %d person(s) choose %s\n", who, theChoice, optionName, this.voted[theChoice], optionName)
		if this.voted[theChoice] == this.Max { // let's move on
			this.result = theChoice
		}
	}
}

func (this *SingleChoiceRaceToMax) IsValidChoice(who string, userSelectedOptions []interface{}) bool {
	idx := utils.InterfaceToInt(userSelectedOptions[0])
	if idx < this.noOfChildren {
		return true
	}
	return false
}

func (this *SingleChoiceRaceToMax) GetTallyResult() (voteconstants.VoteMachineType, int, interface{}) {
	return voteconstants.VM_SingleChoiceRaceToMax, this.result, this.voted
}

func (this *SingleChoiceRaceToMax) GetCurrentVoteState() interface{} {
	log.Println("GetCurrentVoteState: ", this.voted)
	return this.voted
}

func (this *SingleChoiceRaceToMax) GetChoices() interface{} {
	return this.Options
}