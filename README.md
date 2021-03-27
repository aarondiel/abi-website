# abi-website

## project setup

### 1. first install all necessary packages using

```sh
npm run install
```

### 2. create a config.js file in backend for configurating the project

it should have the following structure:

```js
export default {
  port: 1337,
  mongodb: {
    url: 'mongodb://127.0.0.1',
    port: '69429'
  },

  mail: {
    host: 'mail.mailserver.net',
    username: 'elon.musk@teslamotors.com',
    password: 'password123'
  }
}
```

### 4. run the server

```sh
npm run production
```

## systemd service

to run the server as a systemd service,
copy the abi-website.service file into ~/.config/systemd/user/

change the WorkingDirectory according to the installtion directory
of the repository

you can run the service with

```sh
systemctl --user start abi-website.service
```

to enable on startup

```sh
systemctl --user enable abi-website.service
```

and to look at the output of the service

```sh
journalctl --user -f -u abi-website.service
```

note that in order for the process to keep running even if the user logs out
you neet to run

```sh
sudo loginctl enable-linger
```

## for development

### hot-reloading the frontend

```sh
npm run serve
```

### rebuilding the frontend

```sh
npm run build
```

### hot-reloading the backend

```sh
npm run dev
```

## scripts

### sending mails using the mail bot

```sh
npm run mail
```

### running queries on the database
```sh
npm run query
```
