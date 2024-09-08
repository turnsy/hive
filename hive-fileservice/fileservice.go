package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const projectsDir = "./projects"

var (
	fileLocks = make(map[string]*sync.Mutex)
	lockMutex sync.Mutex
)

type FileItem struct {
	ID       string     `json:"id"`
	Name     string     `json:"name"`
	IsDir    bool       `json:"isDir"`
	Children []FileItem `json:"children"`
}

func main() {
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"}),
	)
	r := mux.NewRouter()
	r.HandleFunc("/projects", createProjectHandler).Methods("POST")
	r.HandleFunc("/projects/{project_id}", listProjectHandler).Methods("GET")
	r.HandleFunc("/projects/{project_id}", newEntryHandler).Methods("POST")
	r.HandleFunc("/projects/{project_id}", renameEntryHandler).Methods("PATCH")
	r.HandleFunc("/projects/{project_id}", deleteEntryHandler).Methods("DELETE")
	log.Println("Server started on :8081")
	log.Fatal(http.ListenAndServe(":8081", corsMiddleware(r)))
}

func createProjectHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		DB_ID string `json:"db_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := os.MkdirAll(filepath.Join(projectsDir, req.DB_ID), 0750); err != nil {
		log.Printf("Error creating project: %v", err)
		http.Error(w, "Failed to create project", http.StatusInternalServerError)
		return
	}

	// echo the ID back so service knows where to redirect on FE
	w.Header().Set("Content-Type", "application/json")
	res := map[string]string{"id": req.DB_ID}

	log.Printf("Created new project at %v", req.DB_ID)
	json.NewEncoder(w).Encode(res)
}

func listProjectHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	project := vars["project_id"]
	items, err := listProject(project)
	if err != nil {
		log.Printf("Error listing project: %v", err)
		http.Error(w, "Failed to list project", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Successfully listed project: %v", project)
	json.NewEncoder(w).Encode(items)
}

func newEntryHandler(w http.ResponseWriter, r *http.Request) {

	// TODO: convert this to check if last two chars are md
	vars := mux.Vars(r)
	project := vars["project_id"]

	var req struct {
		Path  string `json:"path"`
		IsDir bool   `json:"isDir"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fullPath := filepath.Join(projectsDir, project, req.Path)
	lock := getFileLock(fullPath)
	lock.Lock()
	if req.IsDir {
		if err := createDir(fullPath); err != nil {
			log.Printf("Error creating directory: %v", err)
			http.Error(w, "Failed to create directory", http.StatusInternalServerError)
			return
		}
	} else {
		if err := createFile(fullPath); err != nil {
			log.Printf("Error creating file: %v", err)
			http.Error(w, "Failed to create file", http.StatusInternalServerError)
			return
		}
	}

	log.Printf("Created new entry at %v", fullPath)

	// TODO: Check these statuses for correctness
	w.WriteHeader(http.StatusOK)
}

func renameEntryHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	project := vars["project_id"]

	var req struct {
		Path   string `json:"path"`
		Rename string `json:"rename"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fullPath := filepath.Join(projectsDir, project, req.Path)
	newPath := filepath.Join(filepath.Dir(fullPath), req.Rename)
	lock := getFileLock(fullPath)
	lock.Lock()

	if err := os.Rename(fullPath, newPath); err != nil {
		log.Printf("Error renaming entry: %v", err)
		http.Error(w, "Failed to rename entry", http.StatusInternalServerError)
		return
	}

	// TODO: check this log statement
	log.Printf("Renamed entry at %v to %v", fullPath, newPath)
	w.WriteHeader(http.StatusOK)
}
func deleteEntryHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	project := vars["project_id"]

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

	if err := os.RemoveAll(fullPath); err != nil {
		log.Printf("Error deleting entry: %v", err)
		http.Error(w, "Failed to delete entry", http.StatusInternalServerError)
		return
	}

	log.Printf("Deleted entry at %v", fullPath)
	w.WriteHeader(http.StatusOK)
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
			ID:   removeParentDirs(filepath.Join(dir, entry.Name()), 2),
			Name: entry.Name(),
		}

		cur_id++

		if entry.IsDir() {
			children, err := getFileItems(filepath.Join(dir, entry.Name()), cur_id)
			if err != nil {
				return nil, err
			}
			item.Children = children
			item.IsDir = true
			cur_id += len(children)
		} else {
			item.Children = []FileItem{}
			item.IsDir = false
		}
		items = append(items, item)
	}

	return items, nil
}

// Helper functions for file operations
func createFile(path string) error {
	return os.WriteFile(path, []byte{}, 0644)
}
func createDir(path string) error {
	return os.Mkdir(path, 0755)
}

// this is helpful for path management
func removeParentDirs(path string, parentsToRemove int) string {
	// Clean the path to normalize it
	cleanPath := filepath.Clean(path)

	// Split the path into its components
	parts := strings.Split(cleanPath, string(filepath.Separator))

	// If we have fewer parts than parents to remove, return an empty string
	if len(parts) <= parentsToRemove {
		return ""
	}

	// Join the remaining parts
	return filepath.Join(parts[parentsToRemove:]...)
}
