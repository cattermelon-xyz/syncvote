package network

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	// "syncvote/enforcer"
	. "syncvote/types"
	"syncvote/utils"
)

func VoteHandler(w http.ResponseWriter, r *http.Request) {
	//Allow CORS here By * or specific origin
	utils.SetupCORS(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()

	var vote Vote
	err := decoder.Decode(&vote)

	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	who := vote.Who
	options := vote.Options
	mission := Missions[vote.MissionId]
	if mission == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := VoteResponse{
			Status:  false,
			Message: "Invalid mission id",
		}
		// golang json encode
		jsonData, _ := json.Marshal(resp)
		fmt.Fprintf(w, "%s", jsonData)
		log.Print("Invalid mission id")
		return
	}
	resp := VoteResponse{
		Option:      vote.Options,
		MachineType: mission.Current.VoteMachineType,
	}

	isValid := mission.IsValidChoice(who, options)
	if !isValid {
		resp.Status = false
		jsonData, _ := json.Marshal(resp)
		fmt.Printf("*%s* %s vote %v, this is an invalid vote\n", mission.Current.VoteMachineType, who, options)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "%s", jsonData)
		return
	}
	resp.Status = true
	current := mission.Current
	current.Vote(who, options)
	_, nextChildId, votedResult := current.GetTallyResult()
	if nextChildId != -1 && votedResult != nil {
		mission.Choose(nextChildId)
		// IsOutput is for demo purpose, in real world, we should use an event
		if mission.Current.IsOuput == true {
			fmt.Printf("The mission is done, the result is %s\n; can tweet now", mission.Current.Name)
			log.Println(votedResult)
			if mission.Current.VoteMachineType == "MultipleChoice" {
				fmt.Printf("Tweet1")
				// enforcer.Tweet("result of " + vote.MissionId + " is: " + fmt.Sprintf("%v", options))
			} else {
				fmt.Printf("Tweet2")
				// enforcer.Tweet("result of " + vote.MissionId + " is: " + mission.Current.Name)
			}
		}
	}
	jsonData, _ := json.Marshal(resp)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "%s", jsonData)
}