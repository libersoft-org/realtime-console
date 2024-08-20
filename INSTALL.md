# Realtime Console - installation instructions

These are download instructions of this software for the different Linux distributions.

## 1. Download the latest version of this software:

### Debian / Ubuntu Linux

```console
apt update
apt -y upgrade
apt -y install git
cd /root/
git clone https://github.com/libersoft-org/realtime-console.git
cd realtime-console
```

### CentOS / RHEL / Fedora Linux

```console
dnf -y update
dnf -y install git
cd /root/
git clone https://github.com/libersoft-org/realtime-console.git
cd realtime-console
```

2. Move the content of the "src" folder to your NGINX web root subdirectory (example for server stored in **/var/www/your-domain.tld/** directory):

```console
mkdir /var/www/your-domain.tld/console
mv ./src /var/www/your-domain.tld/console
```

3. Open the web browser and navigate to: https://your-domain.tld/console/ (replace **your-domain.tld** with your actual NEMP Server domain name)
