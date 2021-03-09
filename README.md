# abi-website

## project setup
### 1. first install all necessary packages using
```
npm install
```
### 2. create a config.json file for configurating the project
it should have the following structure:
```
{
	"port": 1234,
	"mongodb": {
		"url": "mongodb://127.0.0.1",
		"port": "1234"
	}
}
```
### 3. build the static frontend
```
npm run build
```
### 4. run the server
```
npm run production
```

## systemd service
to run the server as a systemd service,
copy the abi-website.service file into ~/.config/systemd/user/

change the WorkingDirectory according to the installtion directory
of the repository

you can run the service with
```
systemctl --user start abi-website.service
```

to enable on startup
```
systemctl --user enable abi-website.service
```

and to look at the output of the service
```
journalctl --user -f -u abi-website.service
```

## for development
### hot-reloading the frontend
```
npm run serve
```

### hot-reloading the backend
```
npm run dev
```

### linting
```
npm run lint
```
