import requests

vote = True
url = "https://schoolvote.vincentscode.de/api/vote"

if vote:
	print("Voting.")
	payload = {
		"userName": "asdf Name",
		"choice": 1,
	}
	r = requests.post(url, data=payload)
	print(r)
	print(r.text)

print("Getting votes.")
r = requests.get(url)
print(r)
print(r.text)