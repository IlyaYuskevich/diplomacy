package handlers

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

func ConnectSupabase() (db *gorm.DB) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		os.Getenv("SUPABASE_HOST"), os.Getenv("SUPABASE_USER"), os.Getenv("SUPABASE_PASSWORD"),
		os.Getenv("SUPABASE_DB_NAME"), os.Getenv("SUPABASE_PORT"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return
}