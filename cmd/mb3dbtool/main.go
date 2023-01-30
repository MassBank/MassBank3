package main

import "github.com/MassBank/MassBank3/pkg/database"

func main() {
	database, err := database.NewMongoDB()
	if err != nil {
		panic(err)
	}
	database.Connect()

}
