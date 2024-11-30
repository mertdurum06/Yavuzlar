package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/net/html"
)

type RSS struct {
	Channel Channel `xml:"channel"`
}

type Channel struct {
	Title       string `xml:"title"`
	Description string `xml:"description"`
	Items       []Item `xml:"item"`
}

type Item struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
}

func cleanHTML(input string) string {
	doc, err := html.Parse(strings.NewReader(input))
	if err != nil {
		return input
	}
	var output strings.Builder
	var traverse func(*html.Node)
	traverse = func(node *html.Node) {
		if node.Type == html.TextNode {
			output.WriteString(node.Data)
		}
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			traverse(child)
		}
	}
	traverse(doc)
	return strings.TrimSpace(output.String())
}

func fetchRSS(url string) (*RSS, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("RSS verisi çekilemedi: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("HTTP Hatası: %d", resp.StatusCode)
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Veri okunamadı: %v", err)
	}

	var rss RSS
	err = xml.Unmarshal(data, &rss)
	if err != nil {
		return nil, fmt.Errorf("XML ayrıştırılamadı: %v", err)
	}

	return &rss, nil
}

func displayAndSaveRSS(rss *RSS, filename string) {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Dosya açma hatası: %v", err)
	}
	defer file.Close()

	fmt.Printf("\n=== %s ===\n\n", rss.Channel.Title)
	for _, item := range rss.Channel.Items {
		fmt.Printf("Başlık   : %s\n", item.Title)
		fmt.Printf("Bağlantı : %s\n", item.Link)
		fmt.Printf("Açıklama : %s\n", cleanHTML(item.Description))
		fmt.Printf("Tarih    : %s\n", item.PubDate)
		fmt.Println(strings.Repeat("-", 40))

		_, err := file.WriteString(fmt.Sprintf("Başlık   : %s\nBağlantı : %s\nAçıklama : %s\nTarih    : %s\n\n", item.Title, item.Link, cleanHTML(item.Description), item.PubDate))
		if err != nil {
			log.Fatalf("Dosyaya yazma hatası: %v", err)
		}
	}

	fmt.Println("Veriler başarıyla ekranda gösterildi ve dosyaya kaydedildi.\n")
}

func mainMenu() {
	rssFeeds := map[string]string{
		"1": "https://rss.app/feeds/q7Bao5cp2V5muk52.xml",
		"2": "https://rss.app/feeds/Ptlt70uYXXwVYcB7.xml",
		"3": "https://rss.app/feeds/jb0mrK7VyvLbnDtB.xml",
	}
	fileNames := map[string]string{
		"1": "npr_news.txt",
		"2": "bbc_news.txt",
		"3": "hacker_news.txt",
	}

	for {
		fmt.Println("Lütfen bir seçenek girin:")
		fmt.Println("1: NPR News verilerini çek.")
		fmt.Println("2: BBC News verilerini çek.")
		fmt.Println("3: The Hacker News verilerini çek.")
		fmt.Println("4: Çıkış")

		var choice string
		fmt.Scanf("%s", &choice)

		if choice == "4" {
			fmt.Println("Çıkış yapılıyor...")
			break
		}

		url, exists := rssFeeds[choice]
		if !exists {
			fmt.Println("Geçersiz seçim. Lütfen tekrar deneyin.")
			continue
		}

		fmt.Printf("RSS verisi çekiliyor: %s\n", url)
		rss, err := fetchRSS(url)
		if err != nil {
			log.Printf("Hata: %v\n", err)
			continue
		}

		filename := fileNames[choice]
		displayAndSaveRSS(rss, filename)
	}
}

func main() {
	mainMenu()
}
