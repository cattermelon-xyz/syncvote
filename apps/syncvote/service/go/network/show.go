package network

import (
	"encoding/json"
	"fmt"
	"syncvote/utils"
	"log"
	"net/http"

	. "syncvote/types"
)

func ShowHandler(w http.ResponseWriter, r *http.Request) {
	utils.SetupCORS(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	missionId := r.URL.Query().Get("id")

	mission := Missions[missionId]
	if mission == nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}
	var allHistoryData []HistoryData
	parent := mission.Current.Parent
	i := 0
	// take the last 5 history data
	for parent != nil {
		i++
		if i > 5 {
			break
		}
		machineType, _, result := parent.VoteMachine.GetTallyResult()
		allHistoryData = append(allHistoryData, HistoryData{
			Name:        parent.Name,
			Voted:       result,
			MachineType: machineType,
		})
		parent = parent.Parent
	}
	// reverse allHistoryData
	for i, j := 0, len(allHistoryData)-1; i < j; i, j = i+1, j-1 {
		allHistoryData[i], allHistoryData[j] = allHistoryData[j], allHistoryData[i]
	}

	resp := ShowResponse{
		MissionId:          missionId,
		MissionName:        mission.Name,
		MissionDescription: mission.Description,
		Name:               mission.Current.Name,
		CurrentVoteResult:  mission.Current.VoteMachine.GetCurrentVoteState(),
		VoteMachineType:    mission.Current.VoteMachineType,
		AllHistoryData:     allHistoryData,
	}
	resp.Choices = mission.Current.VoteMachine.GetChoices()
	mission.Current.Print()
	log.Print(resp)
	jsonData, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, "Error crafting response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s", jsonData)
}