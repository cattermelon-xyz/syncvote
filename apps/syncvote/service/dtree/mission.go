package dtree

import (
	"fmt"
	"syncvote/ppds"
	"log"
)

type Mission struct {
	Name        string
	Description string
	Start       *CheckPoint
	Current     *CheckPoint
}

func CreateMission(root *CheckPoint, name string, description string) *Mission {
	tree := Mission{
		Start:       root,
		Current:     root,
		Name:        name,
		Description: description,
	}
	return &tree
}
func (this *Mission) Print() {
	tree.Print(this.Start)
}
func (this *Mission) PrintFromCurrent() {
	tree.Print(this.Current)
}
func (this *Mission) Choose(idx int) {
	nextCheckPoint := this.Current.Choose(idx)
	if nextCheckPoint == nil {
		fmt.Println(idx, " out of bound, no move")
	}
	if nextCheckPoint != nil {
		machineType, _, result := this.Current.GetTallyResult()
		nextCheckPoint.Start(machineType, result)
		fmt.Printf("from %s choose: %d got %s\n", this.Current.Name, idx, nextCheckPoint.Name)
		this.Current = nextCheckPoint
		this.PrintFromCurrent()
	}
}
func (this *Mission) IsValidChoice(who string, choices []interface{}) bool {
	if this.Current == nil {
		log.Fatal("current CheckPoint is nil")
	}
	return this.Current.IsValidChoice(who, choices)
}