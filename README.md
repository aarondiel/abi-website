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
