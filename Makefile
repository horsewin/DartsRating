all:
	ask deploy -p default

l:
	ask lambda upload -f ask-custom-DartsRating-default -s ./lambda/custom

log:
	ask lambda log --function ask-custom-DartsRating-default --start-time 1hago
