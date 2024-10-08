package main

import (
	"fmt"
	_ "github.com/google/uuid"
	"github.com/joho/godotenv"
	"os/exec"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	cmd := exec.Command(
		"tern",
		"migrate",
		"--migrations",
		"./internal/store/pgstore/migrations",
		"--config",
		"./internal/store/pgstore/migrations/tern.conf",
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Command execution failed with error: %v\n", err)
		fmt.Printf("Output: %s\n", string(output))
		panic(err)
	}

	fmt.Printf("Command executed successfully: %s\n", string(output))
}
