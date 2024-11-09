package main

import (
	"bufio"
	"fmt"
	"os"
	"time"
)

const (
	Admin   = 0
	Musteri = 1
)

type Kullanici struct {
	Username string
	Password string
	Tur      int
}

var kullanicilar []Kullanici
var aktifKullanici *Kullanici

func logYaz(message string) {
	file, err := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("Log dosyası oluşturulamadı.")
		return
	}
	defer file.Close()

	logMessage := fmt.Sprintf("%s - %s\n", time.Now().Format(time.RFC3339), message)
	_, err = file.WriteString(logMessage)
	if err != nil {
		fmt.Println("Log kaydı yazılamadı.")
	}
}

func girisYap() {
	fmt.Println("Lütfen giriş türünüzü seçin: (0: Admin, 1: Musteri)")
	var secim int
	fmt.Scan(&secim)

	fmt.Print("Kullanıcı adınızı girin: ")
	var username string
	fmt.Scan(&username)

	fmt.Print("Şifrenizi girin: ")
	var password string
	fmt.Scan(&password)

	for _, kullanici := range kullanicilar {
		if kullanici.Username == username && kullanici.Password == password && kullanici.Tur == secim {
			aktifKullanici = &kullanici
			logYaz(fmt.Sprintf("Başarılı giriş: %s (%d)", username, secim))
			fmt.Println("Giriş başarılı.")
			return
		}
	}

	logYaz(fmt.Sprintf("Başarısız giriş: %s (%d)", username, secim))
	fmt.Println("Hatalı kullanıcı adı veya şifre.")
}

func adminIslemleri() {
	fmt.Println("Admin işlemleri:")
	fmt.Println("1: Müşteri ekle")
	fmt.Println("2: Müşteri sil")
	fmt.Println("3: Logları listele")
	fmt.Println("Çıkmak için 'q' tuşuna basın.")

	for {
		var secim string
		fmt.Scan(&secim)

		switch secim {
		case "1":
			var username, password string
			fmt.Print("Yeni müşteri kullanıcı adı: ")
			fmt.Scan(&username)
			fmt.Print("Yeni müşteri şifresi: ")
			fmt.Scan(&password)
			kullanici := Kullanici{Username: username, Password: password, Tur: Musteri}
			kullanicilar = append(kullanicilar, kullanici)
			logYaz(fmt.Sprintf("Yeni müşteri eklendi: %s", username))
			fmt.Println("Müşteri eklendi.")
		case "2":
			var username string
			fmt.Print("Silinecek müşteri kullanıcı adı: ")
			fmt.Scan(&username)
			for i, kullanici := range kullanicilar {
				if kullanici.Username == username && kullanici.Tur == Musteri {
					kullanicilar = append(kullanicilar[:i], kullanicilar[i+1:]...)
					logYaz(fmt.Sprintf("Müşteri silindi: %s", username))
					fmt.Println("Müşteri silindi.")
					return
				}
			}
			fmt.Println("Müşteri bulunamadı.")
		case "3":
			file, err := os.Open("log.txt")
			if err != nil {
				fmt.Println("Log dosyası açılamadı.")
				return
			}
			defer file.Close()

			scanner := bufio.NewScanner(file)
			for scanner.Scan() {
				fmt.Println(scanner.Text())
			}

			if err := scanner.Err(); err != nil {
				fmt.Println("Log okuma hatası:", err)
			}
		case "q":
			return
		default:
			fmt.Println("Geçersiz seçim.")
		}
	}
}

func musteriIslemleri() {
	fmt.Println("Müşteri işlemleri:")
	fmt.Println("1: Profil görüntüle")
	fmt.Println("2: Şifre değiştir")
	fmt.Println("Çıkmak için 'q' tuşuna basın.")

	for {
		var secim string
		fmt.Scan(&secim)

		switch secim {
		case "1":
			fmt.Printf("Kullanıcı Adı: %s\n", aktifKullanici.Username)
			fmt.Printf("Şifre: %s\n", aktifKullanici.Password)
		case "2":
			var yeniSifre string
			fmt.Print("Yeni şifreyi girin: ")
			fmt.Scan(&yeniSifre)
			aktifKullanici.Password = yeniSifre
			logYaz(fmt.Sprintf("Şifre değiştirildi: %s", aktifKullanici.Username))
			fmt.Println("Şifreniz değiştirildi.")
		case "q":
			return
		default:
			fmt.Println("Geçersiz seçim.")
		}
	}
}

func oturumKapat() {
	aktifKullanici = nil
	logYaz("Oturum kapatıldı.")
	fmt.Println("Oturum kapatıldı. Giriş yapmanız gerekiyor.")
}

func main() {

	kullanicilar = append(kullanicilar, Kullanici{Username: "admin", Password: "admin", Tur: Admin})
	kullanicilar = append(kullanicilar, Kullanici{Username: "musteri", Password: "musteri", Tur: Musteri})

	for {
		girisYap()

		if aktifKullanici != nil {
			if aktifKullanici.Tur == Admin {
				adminIslemleri()
			} else if aktifKullanici.Tur == Musteri {
				musteriIslemleri()
			}
		}

		if aktifKullanici == nil {
			oturumKapat()
		}
	}
}
