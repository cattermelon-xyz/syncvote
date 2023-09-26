package main

import (
	"syncvote/network"
	"syncvote/examples"
)

func main() {
	// examples.BitWise()
	// _, data := protoexample.NewPerson("Hieu", 35, 1000, 800)
	// p, _ := protoexample.LoadPerson(data)

	// p, _ := protoexample.LoadPersonFromFile("GIehps")

	// fmt.Println("Id: ", p.GetId())
	// fmt.Println("Name: ", p.GetName())
	// fmt.Println("Age: ", p.GetAge())
	// fmt.Println("Twitter Followers: ", p.GetSocialFollower().GetTwitter())
	// fmt.Println("Facebook Followers: ", p.GetSocialFollower().GetFacebook())
	// examples.GoChannelsSync()
	// examples.GoSlices()
	// examples.GoInterfaces()
	// examples.GoBlockchanLogic()
	examples.GoBuildTree("tree.json")
	network.GoServeTree()
	for {
	}
}