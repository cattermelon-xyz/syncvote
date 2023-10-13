package examples_test

import (
	"fmt"
	"syncvote/examples"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIntMinBasic(t *testing.T) {
	ans := examples.IntMin(2, -2)
	assert.Equal(t, ans, -2, "Answer should be -2")
}

func TestIntMinTableDriven(t *testing.T) {
	var tests = []struct {
		a, b int
		want int
	}{
		{0, 1, 0}, {0, 1, 0},
		{1, 0, 0},
		{2, -2, -2},
		{0, -1, -1},
		{-1, 0, -1},
	}
	for _, tt := range tests {
		testname := fmt.Sprintf("%d,%d", tt.a, tt.b)
		t.Run(testname, func(t *testing.T) {
			ans := examples.IntMin(tt.a, tt.b)
			assert.Equal(t, ans, tt.want, "Answer do not match")
		})
	}
}

func BenchmarkTestMin(b *testing.B) {
	for i := 0; i < b.N; i++ {
		examples.IntMin(1, 2)
	}
}