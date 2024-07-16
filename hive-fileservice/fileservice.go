package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const projectsDir = "../hive-projects"

var (
	fileLocks = make(map[string]*sync.Mutex)
	lockMutex sync.Mutex
)

type FileItem struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	Children []FileItem `json:"children"`
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/projects/{project_id}", listProjectHandler).Methods("GET")
	r.HandleFunc("/projects/{project_id}/file", newFileHandler).Methods("POST")
	log.Println("Server started on :8081")
	log.Fatal(http.ListenAndServe(":8081", handlers.CORS()(r)))
}

// Endpoint handlers
func listProjectHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	project := vars["project_id"]
	items, err := listProject(project)
	if err != nil {
		log.Printf("Error listing project: %v", err)
		http.Error(w, "Failed to list project", http.StatusInternalServerError)
		return
	}
	log.Printf("Successfully listed project: %v", project)
	json.NewEncoder(w).Encode(items)
}

func newFileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	project := vars["project"]

	var req struct {
		Path string `json:"path"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fullPath := filepath.Join(projectsDir, project, req.Path)
	lock := getFileLock(fullPath)
	lock.Lock()
	if err := createFile(fullPath); err != nil {
		log.Printf("Error creating file: %v", err)
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}

	log.Printf("Created file at %v", fullPath)
	w.WriteHeader(http.StatusCreated)

}

// Helper functions for file locking
func getFileLock(path string) *sync.Mutex {
	lockMutex.Lock()
	defer lockMutex.Unlock()

	if lock, exists := fileLocks[path]; exists {
		return lock
	}

	lock := &sync.Mutex{}
	fileLocks[path] = lock
	return lock
}

// Helper functions for listProjectHandler
func listProject(project_id string) ([]FileItem, error) {
	projectPath := filepath.Join(projectsDir, project_id)
	return getFileItems(projectPath, 1)
}

func getFileItems(dir string, start_id int) ([]FileItem, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var dirs []os.DirEntry
	var files []os.DirEntry

	// separate dirs and files
	for _, entry := range entries {
		if entry.IsDir() {
			dirs = append(dirs, entry)
		} else {
			files = append(files, entry)
		}
	}
	correctedEntries := append(dirs, files...)

	var items []FileItem
	cur_id := start_id

	// iterate through corrected entries to build entries list, recursively
	for _, entry := range correctedEntries {
		item := FileItem{
			ID:   fmt.Sprintf("%d", cur_id),
			Name: entry.Name(),
		}

		cur_id++

		if entry.IsDir() {
			children, err := getFileItems(filepath.Join(dir, entry.Name()), cur_id)
			if err != nil {
				return nil, err
			}
			item.Children = children
			cur_id += len(children)
		} else {
			item.Children = []FileItem{}
		}
		items = append(items, item)
	}

	return items, nil
}

// Helper functions for file operations
func createFile(path string) error {
	return os.WriteFile(path, []byte{}, 0644)
}
