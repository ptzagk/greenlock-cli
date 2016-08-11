[![Join the chat at https://gitter.im/Daplie/letsencrypt-express](https://badges.gitter.im/Daplie/letsencrypt-express.svg)](https://gitter.im/Daplie/letsencrypt-express?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

| [letsencrypt (library)](https://github.com/Daplie/node-letsencrypt)
| **letsencrypt-cli**
| [letsencrypt-express](https://github.com/Daplie/letsencrypt-express)
| [letsencrypt-koa](https://github.com/Daplie/letsencrypt-koa)
| [letsencrypt-hapi](https://github.com/Daplie/letsencrypt-hapi)
|

# letsencrypt-cli (for node.js)

CLI for node-letsencrypt modeled after the official client.

* Free SSL Certificates
* 90-day certificate lifetime
* One-off standalone registration / renewal
* On-the-fly registration / renewal via webroot

## Install Node

For **Windows**:

Choose **Stable** from <https://nodejs.org/en/>

For Linux and **OS X**:

```
curl -L bit.ly/nodejs-min | bash
```

# Install LetsEncrypt

```bash
npm install -g letsencrypt-cli@2.x
```

## Usage

These commands are shown using the **testing server**.

Want to use the **live server**?

1. remove the `--server https://acme-staging.api.letsencrypt.org/directory`
2. or change it to `--server https://acme-v01.api.letsencrypt.org/directory`

**Note**: This has really only been tested with single domains so if
multiple domains doesn't work for you, file a bug.

### Standalone

You can run standalone mode to get a cert **on the server** you will be
using it for over ports **80 and 443 (or 5001)** like so:

```bash
letsencrypt certonly \
  --agree-tos --email john.doe@example.com \
  --standalone \
  --domains example.com,www.example.com \
  --server https://acme-staging.api.letsencrypt.org/directory \
  --config-dir ~/letsencrypt/etc
```

Then you can see your certs at `~/letsencrypt/etc/live`.

```
ls ~/letsencrypt/etc/live
```

This option is great for testing, but since it requires the use of
the same ports that your webserver needs, it isn't a good choice
for production.

### WebRoot (for production)

You can specify the path to where you keep your `index.html` with `webroot`.

For example, if I want to get a domain for `example.com` and my `index.html` is
at `/srv/www/example.com`, then I would use this command:

```bash
sudo letsencrypt certonly \
  --agree-tos --email john.doe@example.com \
  --webroot --webroot-path /srv/www/example.com \
  --config-dir /etc/letsencrypt \
  --domains example.com,www.example.com \
  --server https://acme-staging.api.letsencrypt.org/directory
```

Note that we use `sudo` because in this example we are using `/etc/letsencrypt`
as the cert directory rather than `~/letsencrypt/etc`, which we used in the previous example.

Then see your brand new shiny certs:

```
ls /etc/letsencrypt/live/
```

You can use a cron job to run the script above every 80 days (the certificates expire after 90 days)
so that you always have fresh certificates.

## Test with a free domain

```bash
# Install Daplie DNS
npm install -g ddns-cli

# see terms of use
ddns --help

# agree to terms and get domain
ddns --random --email user@example.com --agree

# the default is to use the ip address from which
# you can the command, but you can also assign the
# ip manually
ddns --random --email user@example.com --agree -a '127.0.0.1'
```

Example domain:

```
rubber-duck-42.daplie.me
```

## Run without Root

If you'd like to allow node.js to use privileged ports `80` and `443`
(and everything under 1024 really) without being run as `root` or `sudo`,
you can use `setcap` to do so. (it may need to be run any time you reinstall node as well)

```bash
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
```

By default `node-letsencrypt` assumes your home directory `~/letsencrypt/`, but if
you really want to use `/etc/letsencrypt`, `/var/lib/letsencrypt/`, and `/var/log/letsencrypt`
you could change the permissions on them. **Probably a BAD IDEA**. Probabry a security risk.

```
# PROBABLY A BAD IDEA
sudo chown -R $(whoami) /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt
```

## Command line Options

```
Usage:
  letsencrypt [OPTIONS] [ARGS]

Options:
      --email EMAIL             Email used for registration and recovery contact. (default: null)

      --domains URL             Domain names to apply. For multiple domains you can enter a comma
                                separated list of domains as a parameter. (default: [])

      --duplicate BOOLEAN       Allow getting a certificate that duplicates an existing one

      --agree-tos BOOLEAN       Agree to the Let's Encrypt Subscriber Agreement

      --debug BOOLEAN           show traces and logs

      --tls-sni-01-port NUMBER  Use TLS-SNI-01 challenge type with this port. (Default is 443)
                                (must be 443 with most production servers) (Boulder allows 5001 in testing mode)

      --http-01-port [NUMBER]   Use HTTP-01 challenge type with this port, used for SimpleHttp challenge. (Default is 80)
                                (must be 80 with most production servers)

      --dns-01                  Use DNS-01 challenge type.

      --rsa-key-size [NUMBER]   Size (in bits) of the RSA key. (Default is 2048)

      --cert-path STRING        Path to where new cert.pem is saved
                                (Default is :conf/live/:hostname/cert.pem)

      --fullchain-path [STRING] Path to where new fullchain.pem (cert + chain) is saved
                                (Default is :conf/live/:hostname/fullchain.pem)

      --chain-path [STRING]     Path to where new chain.pem is saved
                                (Default is :conf/live/:hostname/chain.pem)

      --domain-key-path STRING  Path to privkey.pem to use for domain (default: generate new)

      --config-dir STRING       Configuration directory. (Default is ~/letsencrypt/etc/)

      --server [STRING]         ACME Directory Resource URI. (Default is https://acme-v01.api.letsencrypt.org/directory))

      --standalone [BOOLEAN]    Obtain certs using a "standalone" webserver.  (Default is true)

      --manual [BOOLEAN]        Print the token and key to the screen and wait for you to hit enter,
                                giving you time to copy it somewhere before continuing. (Default is false)

      --webroot BOOLEAN         Obtain certs by placing files in a webroot directory.

      --webroot-path STRING      public_html / webroot path.

  -h, --help                    Display help and usage details
```

Note: some of the options may not be fully implemented. If you encounter a problem, please report a bug on the issues page.
