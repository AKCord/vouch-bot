
# vouch-bot

> this bot is made by using [the north solution codebase](https://github.com/thenorthsolution/V14Revamped-Codebase). it is a simple bot which is used to track the vouches in a server, stores it in mongodb database and can search by id.
<br>

> [!NOTE]
> credits must be given, if planning to use.
## making a bot

**i.** go to [discord dev portal](https://discord.com/developers/applications)

**ii.** make a new bot then go to the bot tab \
**iii.** copy the bot token and enable all the last three *Privileged Gateway Intents* \
**iv.** go to *oauth2*  and generate an url by clicking on **bot** in **scopes** and tick the required permissions and then copy the bot invite link and invite the bot into your server

## run locally

**i.** clone the project
```cmd
  git clone https://github.com/AKCord/vouch-bot.git
```

**ii.** install dependencies/packages
```cmd
  npm i
```
**iii.** fill the .env
```env
DISCORD_TOKEN="discord_bot_token"
MONGODB_URI="mongo_string"
```
**iv.** run the bot
```cmd
  node .
```


## Support

if any help is needed, contact me on my discord: **akcord**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


