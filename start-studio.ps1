$env:LOCAL_DB_PATH = ((Get-ChildItem .wrangler\state\v3\d1\miniflare-D1DatabaseObject\*.sqlite | Select-Object -First 1).FullName)
drizzle-kit studio
