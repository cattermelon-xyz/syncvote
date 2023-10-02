package multichoiceraccetomax

import (
	"syncvote/utils"
	"syncvote/voteconstants"
)

type MultipleChoiceRaceToMaxData_Option struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type MultipleChoiceRaceToMax struct {
	Options []MultipleChoiceRaceToMaxData_Option `json:"options"`
	Max     int                                  `json:"max"`
	voted   map[int]int
}

func (this *MultipleChoiceRaceToMax) Init(data interface{}, isOuput bool, noOfChildren int) {
	tmp := data.(map[string]interface{})
	var max int
	options := make([]MultipleChoiceRaceToMaxData_Option, 0)
	for key, value := range tmp {
		if key == "options" {
			for _, opt := range value.([]interface{}) {
				options = append(options, MultipleChoiceRaceToMaxData_Option{
					Title:       opt.(map[string]interface{})["title"].(string),
					Description: opt.(map[string]interface{})["description"].(string),
				})
			}
		} else if key == "max" {
			max = utils.InterfaceToInt(value)
		}
		// else if key == "top" {
		// 	top = utils.InterfaceToInt(value)
		// }
	}
	this.Options = options
	this.Max = max
}

func (this *MultipleChoiceRaceToMax) Start(from voteconstants.VoteMachineType, seed interface{}) {
	// aware of who is the seed sender
}

func (this *MultipleChoiceRaceToMax) Vote(who string, userSelectedOptions []interface{}) {
	// choices := make([]int, 0)
	// for _, opt := range userSelectedOptions {
	// 	choices = append(choices, utils.InterfaceToInt(opt))
	// }
	// str := ""
	// data := allData.(MultipleChoiceRaceToMax)
	// max := data.Max
	// options := data.Options
	// for _, choice := range choices {
	// 	str += options[choice].Title + ","
	// 	voted[choice] += 1
	// }
	// // order voted by value desc

	// choosen := make(map[int]int)

	// fmt.Printf("%s vote [%s]; top %d choice win will\n", who, str, max)

	// for opt, choice := range voted {
	// 	if choice >= max {
	// 		choosen[opt] = choice
	// 	}
	// }

	// return 0, choosen
}

func (this *MultipleChoiceRaceToMax) IsValidChoice(who string, userSelectedOptions []interface{}) bool {
	return false
}

func (this *MultipleChoiceRaceToMax) GetTallyResult() (voteconstants.VoteMachineType, int, interface{}) {
	return voteconstants.VM_MultipleChoiceRaceToMax, -1, nil
}

func (this *MultipleChoiceRaceToMax) GetCurrentVoteState() interface{} {
	return nil
}

func (this *MultipleChoiceRaceToMax) GetChoices() interface{} {
	return nil
}