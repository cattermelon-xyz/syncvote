package dtree

import (
	"fmt"
	"syncvote/votemachine"
	"syncvote/voteconstants"
	"syncvote/ppds"
)

type CheckPoint struct {
	Id              string
	Name            string
	Parent          *CheckPoint
	AllChildren     []*CheckPoint
	IsOuput         bool
	VoteMachineType voteconstants.VoteMachineType
	AllData         interface{}
	VoteMachine     votemachine.VoteMachineInterface
}

// return something that is printable
func (n *CheckPoint) Data() interface{} {
	if n.IsOuput == true {
		return n.Id + "*"
	}
	return n.Id
}

// cannot return n.children directly.
// https://github.com/golang/go/wiki/InterfaceSlice
func (n *CheckPoint) Children() (c []tree.Node) {
	for _, child := range n.AllChildren {
		c = append(c, tree.Node(child))
	}
	return
}

// VoteMachineType == "SingleChoice" then option is int; VoteMachineType == "MultiChoice" then option is []string
func (this *CheckPoint) Vote(who string, userSelectedOptions []interface{}) {
	this.VoteMachine.Vote(who, userSelectedOptions)
}

func (this *CheckPoint) Start(from voteconstants.VoteMachineType, input interface{}) {
	this.VoteMachine.Start(from, input)
}

func CreateEmptyCheckPoint(name string, isOutput bool, VoteMachineType voteconstants.VoteMachineType, data interface{}) *CheckPoint {
	checkPoint := CheckPoint{
		Name:            name,
		AllChildren:     []*CheckPoint{},
		IsOuput:         isOutput,
		VoteMachineType: VoteMachineType,
		AllData:         data,
		VoteMachine:     nil,
	}
	return &checkPoint
}
func (this *CheckPoint) FinishAttachChildren() bool {
	machine := votemachine.BuildVoteMachine(this.VoteMachineType, this.AllData, this.IsOuput, len(this.AllChildren))
	if machine == nil {
		return false
	}
	this.VoteMachine = machine
	return true
}
func (this *CheckPoint) Attach(child *CheckPoint) *CheckPoint {
	child.Parent = this
	this.AllChildren = append(this.AllChildren, child)
	return child
}
func (this *CheckPoint) Print() {
	fmt.Printf("%s has following children:\n", this.Name)
	for i := range this.AllChildren {
		fmt.Printf("- opt %d: %s\n", i, this.AllChildren[i].Name)
	}
	fmt.Printf("\n")
}
func (this *CheckPoint) Choose(idx int) *CheckPoint {
	if idx < len(this.AllChildren) {
		return this.AllChildren[idx]
	}
	return nil
}
func (this *CheckPoint) GetTallyResult() (voteconstants.VoteMachineType, int, interface{}) {
	return this.VoteMachine.GetTallyResult()
}
func (this *CheckPoint) IsValidChoice(who string, userSelectedOptions []interface{}) bool {
	if this.VoteMachine == nil {
		return false
	}
	return this.VoteMachine.IsValidChoice(who, userSelectedOptions)
}
func (this *CheckPoint) GetChoices() interface{} {
	return this.VoteMachine.GetChoices()
}

// func (this *CheckPoint) ConvertOptionIdxToString(choices []int) []string {
// 	VoteMachineType := this.VoteMachineType
// 	result := make([]string, 0)
// 	options := votemachine.GetOptions(VoteMachineType, this.AllData)
// 	for _, choice := range choices {
// 		result = append(result, options[choice])
// 	}
// 	return result
// }