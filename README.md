# Sell Me Something

Inspired by [Snake Oil](https://www.snakeoilgame.com/).

## Running with Docker

```bash
# Build image
docker build . -t sell-me-something -f docker/Dockerfile

# Run container
docker run --rm --name sell-me-something -p 8080:80 sell-me-something
```
