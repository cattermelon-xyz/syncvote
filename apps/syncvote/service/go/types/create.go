package types

import "syncvote/voteconstants"

type CreateResponse struct {
	Id string `json:"id"`
}

type MissionData struct {
	Name        string           `json:"name"`
	Description string           `json:"description"`
	Start       string           `json:"start"`
	CheckPoints []CheckPointData `json:"checkpoints"`
}

// TODO: change Parent to Children []string to support multiple parents
type CheckPointData struct {
	Id              string                      `json:"id"`
	Name            string                      `json:"name"`
	Parent          string                      `json:"parent"`
	IsOuput         bool                        `json:"is_output"`
	VoteMachineType voteconstants.VoteMachineType `json:"vote_machine_type"`
	Data            interface{}                 `json:"data"`
}