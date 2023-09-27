package examples

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
)

type MissionData struct {
	Name  string     `json:"name"`
	Start string     `json:"start"`
	Nodes []NodeData `json:"nodes"`
}
type NodeData struct {
	Id     string `json:"id"`
	Parent string `json:"parent"`
}

func GoBuildTree(jsonPath string) {
	file, err := os.Open(jsonPath)
	log.Println(jsonPath)
	if err != nil {
		return
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return
	}

	var missionData MissionData
	err = json.Unmarshal(bytes, &missionData)
	if err != nil {
		return
	}
	// log.Println(missionData)
	startId := missionData.Start
	var nodes = make(map[string]*Node)
	for _, nodeData := range missionData.Nodes {
		// log.Println(nodeData.Id)
		nodes[nodeData.Id] = createEmptyNode(nodeData.Id)
	}
	for _, nodeData := range missionData.Nodes {
		if nodeData.Parent != "" {
			nodes[nodeData.Parent].attach(nodes[nodeData.Id])
		}
	}
	// log.Println("hello")
	// for _, v := range nodes {
	// 	v.print()
	// }
	t := createTree(nodes[startId])
	t.printFromCurrent()
}