package examples

import (
	"fmt"
	"syncvote/ppds"
)

type Node struct {
	name     string
	children []*Node
}

// return something that is printable
func (n *Node) Data() interface{} {
	return n.name
}

// cannot return n.children directly.
// https://github.com/golang/go/wiki/InterfaceSlice
func (n *Node) Children() (c []tree.Node) {
	for _, child := range n.children {
		c = append(c, tree.Node(child))
	}
	return
}

func createEmptyNode(name string) *Node {
	node := Node{
		name:     name,
		children: []*Node{},
	}
	return &node
}
func createNodeWithChildren(name string, children []*Node) *Node {
	node := Node{
		name:     name,
		children: children,
	}
	return &node
}
func (this *Node) attach(child *Node) *Node {
	this.children = append(this.children, child)
	return child
}
func (this *Node) print() {
	fmt.Printf("%s has following children:\n", this.name)
	for i := range this.children {
		fmt.Printf("- opt %d: %s\n", i, this.children[i].name)
	}
	fmt.Printf("\n")
}
func (this *Node) choose(idx int) *Node {
	if idx < len(this.children) {
		return this.children[idx]
	}
	return nil
}
func (this *Node) isValidChoice(idx int) bool {
	if idx < len(this.children) {
		return true
	}
	return false
}

type Tree struct {
	start   *Node
	current *Node
}

func createTree(root *Node) *Tree {
	tree := Tree{
		start:   root,
		current: root,
	}
	return &tree
}
func (this *Tree) print() {
	tree.Print(this.start)
}
func (this *Tree) printFromCurrent() {
	tree.Print(this.current)
}
func (this *Tree) choose(idx int) {
	nextNode := this.current.choose(idx)
	if nextNode == nil {
		fmt.Println(idx, " out of bound, no move")
	}
	if nextNode != nil {
		fmt.Printf("from %s choose: %d got %s\n", this.current.name, idx, nextNode.name)
		this.current = nextNode
		this.printFromCurrent()
	}
}
func (this *Tree) isValidChoice(idx int) bool {
	return this.current.isValidChoice(idx)
}

var voted = make(map[int]int)

// if there are 3 person vote for an option; it will be validated
func vote(tree *Tree, who string, option int) {
	isValid := tree.isValidChoice(option)
	if !isValid {
		fmt.Printf("%s vote %d, this is an invalid vote\n", who, option)
		return
	}
	voted[option] += 1
	optionName := tree.current.children[option].name
	fmt.Printf("%s vote %d [%s]. There are %d person(s) choose %s\n", who, option, optionName, voted[option], optionName)
	if voted[option] == 3 { // let's move on
		tree.choose(option)
		voted = make(map[int]int)
	}
}

func GoTree() {
	// a -> b, c
	// b -> d, e
	// c -> f
	// d -> g, h, k
	e, f, g, h, k := createEmptyNode("e"), createEmptyNode("f"), createEmptyNode("g"), createEmptyNode("h"), createEmptyNode("k")
	d := createNodeWithChildren("d", []*Node{g, h, k})
	c := createNodeWithChildren("c", []*Node{f})
	b := createNodeWithChildren("b", []*Node{d, e})
	a := createNodeWithChildren("a", []*Node{b, c})
	a1 := createEmptyNode("a1")
	a.attach(a1)

	// tree.Print(a)
	fmt.Println("Original tree:")
	t := createTree(a)
	t.printFromCurrent()
	vote(t, "alice", 0)
	vote(t, "bob", 1)
	vote(t, "jason", 0)
	vote(t, "kim", 0)
	vote(t, "dean", 1)
	vote(t, "hank", 0)
	vote(t, "alice", 0)
	vote(t, "bob", 0)
	vote(t, "hank", 2)
	vote(t, "alice", 1)
	vote(t, "bob", 2)
	vote(t, "jason", 0)
	vote(t, "kim", 2)
}