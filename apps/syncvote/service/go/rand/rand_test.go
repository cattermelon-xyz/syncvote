package main

import (
	"math/rand"
	"testing"
	"time"
)

// original article: https://stackoverflow.com/a/31832326/1232975

func init() {
	rand.Seed(time.Now().UnixNano())
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := 0; i < n; i++ {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func RandStringRunesWithRange(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := 0; i < n; i++ {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func RandStringBytesWithRange(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func RandStringBytesRmndr(n int) string {
	b := make([]byte, n)
	for i := 0; i < n; i++ {
		/*
			take a non-negative pseudo-random 63-bit integer as an int64 which is faster than IntN;
			mod with len(letterBytes)
			the result is a random number that is smaller than len(letterBytes)
		*/
		b[i] = letterBytes[rand.Int63()%int64(len(letterBytes))]
	}
	return string(b)
}

func RandStringBytesRmndrWithRange(n int) string {
	b := make([]byte, n)
	for i := range b {
		/*
			take a non-negative pseudo-random 63-bit integer as an int64 which is faster than IntN;
			mod with len(letterBytes)
			the result is a random number that is smaller than len(letterBytes)
		*/
		b[i] = letterBytes[rand.Int63()%int64(len(letterBytes))]
	}
	return string(b)
}

// 1&1 -> 1, 0&1 -> 0, 1&0 -> 0, 0&0 -> 0 =>
// & with 111000 keep 3 biggest bit and clear 3 smallest bit
// & with 000111 keep 3 smallest bit and clear 3 biggest bit
const (
	letterIdxBits = 6                    // 52 letter, 52 = 110100b => keep 6 smallest bit, zer0 the rest
	letterIdxMask = 1<<letterIdxBits - 1 // 1b move right 6 pos -> 1000000, -1 and turn into 0111111
)

func RandStringBytesMask(n int) string {
	b := make([]byte, n)
	for i := 0; i < n; { // instead of `range`, manually increase i if condition is met
		// let's mask -> got a number up to 63; check if the result is smaller than 52
		if idx := int(rand.Int63() & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i++
		}
	}
	return string(b)
}

// rand.Int63() a 63 bit number; let's use up all of those instead of truncating bits
// there are 52 letter so we need 6 bit
// 63 bit mean each random iteration give 10 (6bit x 10) number,
// we would use a mask to keep 6 smallest bits and shift the random number to the right 10 times
const (
	letterIdxMax = 63 / letterIdxBits
)

func RandStringBytesMaskImpr(n int) string {
	b := make([]byte, n)
	// A rand.Int63() generates 63 random bits, enough for letterIdxMax letters!
	for i, cache, remain := n-1, rand.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 { // remain = 0 -> init new random number and assign to cache and restart remain
			cache, remain = rand.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		// shift cache 6 bit to the right
		cache = cache >> letterIdxBits
		remain--
	}
	return string(b)
}

// Benchmark function
const n = 16

func BenchmarkRunes(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringRunes(n)
	}
}

func BenchmarkRunesWithRange(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringRunesWithRange(n)
	}
}

func BenchmarkBytes(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytes(n)
	}
}

func BenchmarkBytesWithRange(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytesWithRange(n)
	}
}

func BenchmarkBytesRmndr(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytesRmndr(n)
	}
}

func BenchmarkBytesRmndrWithRange(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytesRmndrWithRange(n)
	}
}

func BenchmarkBytesMask(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytesMask(n)
	}
}

func BenchmarkByteMaskImpr(b *testing.B) {
	for i := 0; i < b.N; i++ {
		RandStringBytesMaskImpr(n)
	}
}