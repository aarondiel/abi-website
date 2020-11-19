import requests

vote = True
url = "http://localhost:4000/api/vote"

if vote:
	print("Voting.")
	payload = {
		"userAccessCode": "<uac>",
		"choice": 6,
	}
	r = requests.post(url, data=payload)
	print(r)
	print(r.text)

print("Getting votes.")
r = requests.get(url)
print(r)
print(r.text)