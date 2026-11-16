package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

// readEnvValue ищет переменную key в файле .env
func readEnvValue(path, key string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		line = strings.TrimPrefix(line, "export ")

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		if strings.TrimSpace(parts[0]) == key {
			value := strings.TrimSpace(parts[1])
			return strings.Trim(value, `"'`), nil
		}
	}
	if err := scanner.Err(); err != nil {
		return "", err
	}
	return "", fmt.Errorf("переменная %s не найдена в %s", key, path)
}

type repo struct {
	FullName string `json:"full_name"`
	Private  bool   `json:"private"`
}

func main() {
	// Имя переменной можно передать аргументом: go run main.go MY_TOKEN
	key := "GITHUB_TOKEN"
	if len(os.Args) > 1 {
		key = os.Args[1]
	}

	token, err := readEnvValue(".env", key)
	if err != nil {
		fmt.Fprintln(os.Stderr, "ошибка:", err)
		os.Exit(1)
	}

	client := &http.Client{}
	total := 0

	// GitHub отдает репозитории постранично (до 100 за запрос)
	for page := 1; ; page++ {
		url := fmt.Sprintf("https://api.github.com/user/repos?per_page=100&page=%d&affiliation=owner,collaborator,organization_member", page)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Fprintln(os.Stderr, "ошибка запроса:", err)
			os.Exit(1)
		}
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Accept", "application/vnd.github+json")
		req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

		resp, err := client.Do(req)
		if err != nil {
			fmt.Fprintln(os.Stderr, "ошибка сети:", err)
			os.Exit(1)
		}

		if resp.StatusCode != http.StatusOK {
			resp.Body.Close()
			fmt.Fprintf(os.Stderr, "GitHub вернул статус %s (проверьте токен и его права)\n", resp.Status)
			os.Exit(1)
		}

		var repos []repo
		err = json.NewDecoder(resp.Body).Decode(&repos)
		resp.Body.Close()
		if err != nil {
			fmt.Fprintln(os.Stderr, "ошибка разбора ответа:", err)
			os.Exit(1)
		}

		if len(repos) == 0 {
			break
		}

		for _, r := range repos {
			visibility := "public"
			if r.Private {
				visibility = "private"
			}
			fmt.Printf("%s (%s)\n", r.FullName, visibility)
		}
		total += len(repos)
	}

	fmt.Printf("\nВсего репозиториев: %d\n", total)
}
