package network

import (
	. "syncvote/dtree"
	"log"
	"net/http"
)

var Missions = make(map[string]*Mission)

func GoServeTree() {
	http.HandleFunc("/create", CreateHandler)
	http.HandleFunc("/vote", VoteHandler)
	http.HandleFunc("/show", ShowHandler)
	log.Println("Server start at 8080")

	http.ListenAndServe(":8080", nil)
}