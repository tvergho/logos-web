# Logos Web

## Overview

This repository contains the web client for the Logos application. Logos is an application designed to scrape the high-school and college debate open-source wikis, parse Word documents containing debate evidence (or "cards"), and render that evidence searchable through a web frontend client.

The **deployed** version is available [here](https://logos-debate.netlify.app/). Running this application entirely locally is possible, but requires the [backend](https://github.com/tvergho/verbatim-parser) environment to also be installed and running.

This software is free to use and distribute, but note that the debate wikis – as well as the cards this app is designed to parse – are the product of other people's time, resources, and research. Please respect their efforts accordingly. 
## Installation and deployment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, install [Node.js](https://nodejs.org/en/download/) and then the relevant dependencies with:

```bash
yarn install
```

Next, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

MIT