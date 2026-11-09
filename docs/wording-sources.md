# Wording sources (M3)

Every word in `src/data/wording/<lang>.json` comes from Twitter's own interface
as archived by the Wayback Machine (spec §11: no guessed translations). Columns:
language, key, era, word, source (archive URL and what was read there).

Sources: legacy profile pages `twitter.com/twitter?lang=xx` and permalinks
`twitter.com/jack/status/20?lang=xx` (2015 for the 2014 era, 2018 for the 2017
era), Twitter's 2015 `abs.twimg.com/c/swift/<lang>/bundle/boot.*.js` bundles,
the 2018 `abs.twimg.com/k/<lang>/0.commons` bundles and the December 2018
`abs.twimg.com/responsive-web/web/i18n/<lang>.*.js` bundles (string ids mapped
through the English bundle of the same build). Collected 2026-11-09 by three
research passes; values without a source are `null` (X's own word stays).

Rulings:

- `composeButton`: logged-out archives never show the side "Tweet" button; where
  no source was found it uses the composer's "Tweet" button string of the same
  era (marked "derived").
- `quotesLabel`: "Quote Tweets" counts appeared in 2020; null in both eras.
- `quoteAction` 2014: the 2015 "retweet with comment" dialog title (no menu
  item existed then).
- ru repostsLabel 2014: "Ретвитов" is a count-dependent genitive form, not a standalone label — set to null.
- ru repostsLabel 2017: "ретвитов" is a count-dependent genitive form, not a standalone label — set to null.
- Arabic `undoRepostAction` 2017 is kept as Twitter shipped it
  ("التراجع عن التغريدة").

| lang | key | era | word | source |
|---|---|---|---|---|
| ar | composeButton | 2014 | تغريد | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| ar | composeButton | 2017 | تغريد | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key c6432564 (English "Tweet" in same-era en bundle) = "تغريد" |
| ar | composeSubmit | 2014 | تغريد | https://web.archive.org/web/20150320162757/https://twitter.com/jack/status/20?lang=ar — retweet/quote dialog button span.RetweetDialog-tweetActionLabel: "تغريد" (indirect: submit label of dialog when comment added) |
| ar | composeSubmit | 2017 | تغريد | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key c6432564 = "تغريد" |
| ar | repostAction | 2014 | إعادة تغريد | https://web.archive.org/web/20150320162757/https://twitter.com/jack/status/20?lang=ar — title="إعادة تغريد" data-modal="ProfileTweet-retweet" |
| ar | repostAction | 2017 | إعادة التغريد | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key ce6d3a76 (English "Retweet") = "إعادة التغريد" |
| ar | undoRepostAction | 2014 | إلغاء إعادة التغريد | https://web.archive.org/web/20150320162757/https://twitter.com/jack/status/20?lang=ar — ProfileTweet-actionButtonUndo title="إلغاء إعادة التغريد" |
| ar | undoRepostAction | 2017 | التراجع عن التغريدة | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key e9a6d146 (English "Undo Retweet") = "التراجع عن التغريدة" (DOUBTFUL: literally "undo the tweet"; this is what the archived ar bundle contains) |
| ar | quoteAction | 2017 | إعادة التغريد بتعليق | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key dcaee2df (English "Retweet with comment") = "إعادة التغريد بتعليق" |
| ar | repostsLabel | 2014 | إعادات تغريد | https://web.archive.org/web/20150320162757/https://twitter.com/jack/status/20?lang=ar — li.js-stat-retweets label: "إعادات تغريد" |
| ar | repostsLabel | 2017 | إعادات تغريد | https://web.archive.org/web/20181218114420/https://twitter.com/jack/status/20?lang=ar — data-activity-popup-title="١٠٨٬٥٠٧ إعادات تغريد" (visible label that day was typo'd "إعاداتا تغريد"; https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js key a9d61ca2 builds it from plural forms) |
| ar | likesLabel | 2014 | المفضّلات | https://web.archive.org/web/20150601184749/https://twitter.com/twitter?lang=ar — ProfileNav-label (favorites tab): "المفضّلات" |
| ar | likesLabel | 2017 | الإعجابات | https://web.archive.org/web/20181209161508js_/https://abs.twimg.com/responsive-web/web/i18n/ar.dbf32384418eabb0.js — key fbffbecb (English "Likes") = "الإعجابات"; profile tab at https://web.archive.org/web/20180601194852/https://twitter.com/twitter?lang=ar agrees |
| ar | profilePostsTab | 2014 | تغريدات | https://web.archive.org/web/20150601184749/https://twitter.com/twitter?lang=ar — ProfileNav-label (tweets tab): "تغريدات" |
| ar | profilePostsTab | 2017 | التغريدات | https://web.archive.org/web/20180601194852/https://twitter.com/twitter?lang=ar — ProfileNav-label (tweets tab): "التغريدات" |
| de | composeButton | 2014 | Twittern | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| de | composeButton | 2017 | Twittern | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key c6432564 (English "Tweet" in same-era en bundle) = "Twittern" |
| de | composeSubmit | 2014 | Twittern | https://web.archive.org/web/20150320162803/https://twitter.com/jack/status/20?lang=de — retweet/quote dialog button span.RetweetDialog-tweetActionLabel: "Twittern" (indirect: submit label of dialog when comment added) |
| de | composeSubmit | 2017 | Twittern | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key c6432564 = "Twittern" |
| de | repostAction | 2014 | Retweeten | https://web.archive.org/web/20150320162803/https://twitter.com/jack/status/20?lang=de — title="Retweeten" data-modal="ProfileTweet-retweet" |
| de | repostAction | 2017 | Retweeten | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key ce6d3a76 (English "Retweet") = "Retweeten" |
| de | undoRepostAction | 2014 | Retweet rückgängig machen | https://web.archive.org/web/20150320162803/https://twitter.com/jack/status/20?lang=de — ProfileTweet-actionButtonUndo title="Retweet rückgängig machen" |
| de | undoRepostAction | 2017 | Retweet rückgängig machen | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key e9a6d146 (English "Undo Retweet") = "Retweet rückgängig machen" |
| de | quoteAction | 2017 | Mit Kommentar retweeten | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key dcaee2df (English "Retweet with comment") = "Mit Kommentar retweeten" |
| de | repostsLabel | 2014 | Retweets | https://web.archive.org/web/20150320162803/https://twitter.com/jack/status/20?lang=de — li.js-stat-retweets label: "Retweets" |
| de | repostsLabel | 2017 | Retweets | https://web.archive.org/web/20181218114431/https://twitter.com/jack/status/20?lang=de — li.js-stat-retweets label: "Retweets"; https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js key a9d61ca2 |
| de | likesLabel | 2014 | Favoriten | https://web.archive.org/web/20150610212947/https://twitter.com/twitter?lang=de — ProfileNav-label (favorites tab): "Favoriten" |
| de | likesLabel | 2017 | Gefällt mir | https://web.archive.org/web/20181206233257js_/https://abs.twimg.com/responsive-web/web/i18n/de.5a44997a778bbee8.js — key fbffbecb (English "Likes") = "Gefällt mir"; profile tab at https://web.archive.org/web/20180601194900/https://twitter.com/twitter?lang=de agrees |
| de | profilePostsTab | 2014 | Tweets | https://web.archive.org/web/20150610212947/https://twitter.com/twitter?lang=de — ProfileNav-label (tweets tab): "Tweets" |
| de | profilePostsTab | 2017 | Tweets | https://web.archive.org/web/20180601194900/https://twitter.com/twitter?lang=de — ProfileNav-label (tweets tab): "Tweets" |
| en | composeButton | 2014 | Tweet | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| en | composeButton | 2017 | Tweet | derived: the composer's "Tweet" button string of the same era (composeSubmit 2017) |
| en | composeSubmit | 2014 | Tweet | https://web.archive.org/web/20151002060417/https://abs.twimg.com/c/swift/en/bundle/boot.e59d06bd9db85ffd6d1e0f0c9d02e03e1f90a71f.js (Hogan template tweet_button, class tweet-btn: t.b("Tweet")) — "Tweet" |
| en | composeSubmit | 2017 | Tweet | https://web.archive.org/web/20181206193136/https://abs.twimg.com/responsive-web/web/i18n/en.c504ee4f20fe5768.js (id c6432564 "Tweet" -> "Tweet"; usage context in app code not verified) — "Tweet" |
| en | repostAction | 2014 | Retweet | https://web.archive.org/web/20151002060417/https://twitter.com/twitter?lang=en (title attr / u-hiddenVisually on tweet action) — "Retweet" |
| en | repostAction | 2017 | Retweet | https://web.archive.org/web/20180111122145/https://twitter.com/twitter?lang=en (title attr / u-hiddenVisually on tweet action) — "Retweet" |
| en | undoRepostAction | 2014 | Undo retweet | https://web.archive.org/web/20151002060417/https://twitter.com/twitter?lang=en (title attr of retweeted action) — "Undo retweet" |
| en | undoRepostAction | 2017 | Undo Retweet | https://web.archive.org/web/20181206193136/https://abs.twimg.com/responsive-web/web/i18n/en.c504ee4f20fe5768.js (id e9a6d146 "Undo Retweet"); legacy page https://web.archive.org/web/20180111122145/https://twitter.com/twitter?lang=en has title="Undo retweet" |
| en | quoteAction | 2014 | Quote Tweet | https://web.archive.org/web/20151002060417/https://abs.twimg.com/c/swift/en/bundle/boot.e59d06bd9db85ffd6d1e0f0c9d02e03e1f90a71f.js (_() string "Quote Tweet" = title of retweet-with-comment dialog; not a menu item label) — "Quote Tweet" |
| en | quoteAction | 2017 | Retweet with comment | https://web.archive.org/web/20181206193136/https://abs.twimg.com/responsive-web/web/i18n/en.c504ee4f20fe5768.js (id dcaee2df "Retweet with comment") — "Retweet with comment" |
| en | repostsLabel | 2014 | Retweets | https://web.archive.org/web/20150320162756/https://twitter.com/jack/status/20?lang=en (permalink stat js-stat-retweets) — "Retweets" |
| en | repostsLabel | 2017 | Retweets | https://web.archive.org/web/20181206193136/https://abs.twimg.com/responsive-web/web/i18n/en.c504ee4f20fe5768.js (id a9d61ca2 count label function, plural) — "Retweets" |
| en | likesLabel | 2014 | Favorites | https://web.archive.org/web/20150320162756/https://twitter.com/jack/status/20?lang=en (permalink stat js-stat-favorites); also profile tab https://web.archive.org/web/20151002060417/https://twitter.com/twitter?lang=en — "Favorites" |
| en | likesLabel | 2017 | Likes | https://web.archive.org/web/20181206193136/https://abs.twimg.com/responsive-web/web/i18n/en.c504ee4f20fe5768.js (id b51a7d1b count label / fbffbecb tab); legacy profile tab https://web.archive.org/web/20180111122145/https://twitter.com/twitter?lang=en — "Likes" |
| en | profilePostsTab | 2014 | Tweets | https://web.archive.org/web/20151002060417/https://twitter.com/twitter?lang=en (ProfileNav-label) — "Tweets" |
| en | profilePostsTab | 2017 | Tweets | https://web.archive.org/web/20180111122145/https://twitter.com/twitter?lang=en (ProfileNav-label) — "Tweets" |
| es | composeButton | 2014 | Twittear | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| es | composeButton | 2017 | Twittear | derived: the composer's "Tweet" button string of the same era (composeSubmit 2017) |
| es | composeSubmit | 2014 | Twittear | https://web.archive.org/web/20151002060421/https://abs.twimg.com/c/swift/es/bundle/boot.b8a060b362c365e4fcd4533b121a662f907c5d7f.js (Hogan template tweet_button, class tweet-btn: t.b("Twittear")) — "Twittear" |
| es | composeSubmit | 2017 | Twittear | https://web.archive.org/web/20181208050359/https://abs.twimg.com/responsive-web/web/i18n/es.45c425d45124330d.js (id c6432564 "Tweet" -> "Twittear"; usage context in app code not verified) — "Twittear" |
| es | repostAction | 2014 | Retwittear | https://web.archive.org/web/20151002060421/https://twitter.com/twitter?lang=es (title attr / u-hiddenVisually on tweet action) — "Retwittear" |
| es | repostAction | 2017 | Retwittear | https://web.archive.org/web/20180111122151/https://twitter.com/twitter?lang=es (title attr / u-hiddenVisually on tweet action) — "Retwittear" |
| es | undoRepostAction | 2014 | Deshacer Retweet | https://web.archive.org/web/20151002060421/https://twitter.com/twitter?lang=es (title attr of retweeted action) — "Deshacer Retweet" |
| es | undoRepostAction | 2017 | Deshacer Retweet | https://web.archive.org/web/20181208050359/https://abs.twimg.com/responsive-web/web/i18n/es.45c425d45124330d.js (id e9a6d146 "Undo Retweet"); legacy page https://web.archive.org/web/20180111122151/https://twitter.com/twitter?lang=es has title="Deshacer Retweet" |
| es | quoteAction | 2014 | Citar Tweet | https://web.archive.org/web/20151002060421/https://abs.twimg.com/c/swift/es/bundle/boot.b8a060b362c365e4fcd4533b121a662f907c5d7f.js (_() string "Quote Tweet" = title of retweet-with-comment dialog; not a menu item label) — "Citar Tweet" |
| es | quoteAction | 2017 | Retwittear con comentario | https://web.archive.org/web/20181208050359/https://abs.twimg.com/responsive-web/web/i18n/es.45c425d45124330d.js (id dcaee2df "Retweet with comment") — "Retwittear con comentario" |
| es | repostsLabel | 2014 | Retweets | https://web.archive.org/web/20150320162801/https://twitter.com/jack/status/20?lang=es (permalink stat js-stat-retweets) — "Retweets" |
| es | repostsLabel | 2017 | Retweets | https://web.archive.org/web/20181208050359/https://abs.twimg.com/responsive-web/web/i18n/es.45c425d45124330d.js (id a9d61ca2 count label function, plural) — "Retweets" |
| es | likesLabel | 2014 | Favoritos | https://web.archive.org/web/20150320162801/https://twitter.com/jack/status/20?lang=es (permalink stat js-stat-favorites); also profile tab https://web.archive.org/web/20151002060421/https://twitter.com/twitter?lang=es — "Favoritos" |
| es | likesLabel | 2017 | Me gusta | https://web.archive.org/web/20181208050359/https://abs.twimg.com/responsive-web/web/i18n/es.45c425d45124330d.js (id b51a7d1b count label / fbffbecb tab); legacy profile tab https://web.archive.org/web/20180111122151/https://twitter.com/twitter?lang=es — "Me gusta" |
| es | profilePostsTab | 2014 | Tweets | https://web.archive.org/web/20151002060421/https://twitter.com/twitter?lang=es (ProfileNav-label) — "Tweets" |
| es | profilePostsTab | 2017 | Tweets | https://web.archive.org/web/20180111122151/https://twitter.com/twitter?lang=es (ProfileNav-label) — "Tweets" |
| fr | composeButton | 2014 | Tweeter | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| fr | composeButton | 2017 | Tweeter | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key c6432564 (English "Tweet" in same-era en bundle) = "Tweeter" |
| fr | composeSubmit | 2014 | Tweeter | https://web.archive.org/web/20150320162754/https://twitter.com/jack/status/20?lang=fr — retweet/quote dialog button span.RetweetDialog-tweetActionLabel: "Tweeter" (indirect: submit label of dialog when comment added) |
| fr | composeSubmit | 2017 | Tweeter | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key c6432564 = "Tweeter" |
| fr | repostAction | 2014 | Retweeter | https://web.archive.org/web/20150320162754/https://twitter.com/jack/status/20?lang=fr — title="Retweeter" data-modal="ProfileTweet-retweet" |
| fr | repostAction | 2017 | Retweeter | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key ce6d3a76 (English "Retweet") = "Retweeter" |
| fr | undoRepostAction | 2014 | Annuler le retweet | https://web.archive.org/web/20150320162754/https://twitter.com/jack/status/20?lang=fr — ProfileTweet-actionButtonUndo title="Annuler le retweet" |
| fr | undoRepostAction | 2017 | Annuler le Retweet | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key e9a6d146 (English "Undo Retweet") = "Annuler le Retweet" |
| fr | quoteAction | 2017 | Retweeter avec un commentaire | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key dcaee2df (English "Retweet with comment") = "Retweeter avec un commentaire" |
| fr | repostsLabel | 2014 | Retweets | https://web.archive.org/web/20150320162754/https://twitter.com/jack/status/20?lang=fr — li.js-stat-retweets label: "Retweets" |
| fr | repostsLabel | 2017 | Retweets | https://web.archive.org/web/20181218114417/https://twitter.com/jack/status/20?lang=fr — li.js-stat-retweets label: "Retweets"; https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js key a9d61ca2 |
| fr | likesLabel | 2014 | Favoris | https://web.archive.org/web/20150601184744/https://twitter.com/twitter?lang=fr — ProfileNav-label (favorites tab): "Favoris" |
| fr | likesLabel | 2017 | J'aime | https://web.archive.org/web/20181208011505js_/https://abs.twimg.com/responsive-web/web/i18n/fr.151619d6cc74ff1e.js — key fbffbecb (English "Likes") = "J'aime"; profile tab at https://web.archive.org/web/20180601194847/https://twitter.com/twitter?lang=fr agrees |
| fr | profilePostsTab | 2014 | Tweets | https://web.archive.org/web/20150601184744/https://twitter.com/twitter?lang=fr — ProfileNav-label (tweets tab): "Tweets" |
| fr | profilePostsTab | 2017 | Tweets | https://web.archive.org/web/20180601194847/https://twitter.com/twitter?lang=fr — ProfileNav-label (tweets tab): "Tweets" |
| id | composeButton | 2014 | Tweet | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| id | composeButton | 2017 | Tweet | https://web.archive.org/web/20181211194900id_/https://abs.twimg.com/responsive-web/web/i18n/id.eb0fed937ef5a82c.js — key c6432564 (English "Tweet" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Tweet" [PWA bundle Dec 2018; role as nav compose button inferred] |
| id | composeSubmit | 2014 | Tweet | https://web.archive.org/web/20151113220941id_/https://abs.twimg.com/c/swift/id/bundle/boot.4810b28197e8dd648ccca38952b63304c7b76af6.js — tweet_button template, default text "Tweet" |
| id | composeSubmit | 2017 | Tweet | https://web.archive.org/web/20180503082042id_/https://abs.twimg.com/k/id/0.commons.id.751979b69cffbe329907.js — replyButtonTextSelector.text("Tweet") (legacy composer button text, Tweet vs Reply) |
| id | repostAction | 2014 | Retweet | https://web.archive.org/web/20150531164554id_/https://twitter.com/twitter?lang=id — title="Retweet" on js-actionRetweet button |
| id | repostAction | 2017 | Retweet | https://web.archive.org/web/20180503082042id_/https://twitter.com/twitter?lang=id — title="Retweet" on js-actionRetweet button |
| id | undoRepostAction | 2014 | Batalkan retweet | https://web.archive.org/web/20150531164554id_/https://twitter.com/twitter?lang=id — title="Batalkan retweet" on ProfileTweet-actionButtonUndo (retweet) |
| id | undoRepostAction | 2017 | Batalkan retweet | https://web.archive.org/web/20180503082042id_/https://twitter.com/twitter?lang=id — title="Batalkan retweet" on ProfileTweet-actionButtonUndo (retweet) |
| id | quoteAction | 2014 | Kutip Tweet | https://web.archive.org/web/20151113220941id_/https://abs.twimg.com/c/swift/id/bundle/boot.4810b28197e8dd648ccca38952b63304c7b76af6.js — uiDialogUpdateTitle title when retweeting with comment: "Kutip Tweet" (dialog title; no menu item existed) |
| id | quoteAction | 2017 | Retweet dengan komentar | https://web.archive.org/web/20181211194900id_/https://abs.twimg.com/responsive-web/web/i18n/id.eb0fed937ef5a82c.js — key dcaee2df (English "Retweet with comment" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Retweet dengan komentar" |
| id | repostsLabel | 2014 | Retweet | https://web.archive.org/web/20150816053633id_/https://twitter.com/jack/status/20?lang=id — permalink stat label after <strong>count</strong>: "Retweet" |
| id | repostsLabel | 2017 | Retweet | https://web.archive.org/web/20180413045813id_/https://twitter.com/jack/status/20?lang=id — permalink stat label: "Retweet" |
| id | likesLabel | 2014 | Favorit | https://web.archive.org/web/20150531164554id_/https://twitter.com/twitter?lang=id — ProfileNav-label "Favorit" |
| id | likesLabel | 2017 | Suka | https://web.archive.org/web/20180503082042id_/https://twitter.com/twitter?lang=id — ProfileNav-label "Suka" |
| id | profilePostsTab | 2014 | Tweet | https://web.archive.org/web/20150531164554id_/https://twitter.com/twitter?lang=id — first ProfileNav-label "Tweet" |
| id | profilePostsTab | 2017 | Tweet | https://web.archive.org/web/20180503082042id_/https://twitter.com/twitter?lang=id — first ProfileNav-label "Tweet" |
| it | composeButton | 2014 | Tweet | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| it | composeButton | 2017 | Twitta | https://web.archive.org/web/20181210141709id_/https://abs.twimg.com/responsive-web/web/i18n/it.f8af8f4b1cac67e5.js — key c6432564 (English "Tweet" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Twitta" [PWA bundle Dec 2018; role as nav compose button inferred] |
| it | composeSubmit | 2014 | Tweet | https://web.archive.org/web/20151113221317id_/https://abs.twimg.com/c/swift/it/bundle/boot.c5789241c3ddc2e50f4a0ea0d0b64bffa3840f72.js — tweet_button template, default text "Tweet" |
| it | composeSubmit | 2017 | Tweet | https://web.archive.org/web/20180503082039id_/https://abs.twimg.com/k/it/0.commons.it.4aa4eb5b4b3a86e08a20.js — replyButtonTextSelector.text("Tweet") (legacy composer button text, Tweet vs Reply) |
| it | repostAction | 2014 | Retweet | https://web.archive.org/web/20150531164552id_/https://twitter.com/twitter?lang=it — title="Retweet" on js-actionRetweet button |
| it | repostAction | 2017 | Retweet | https://web.archive.org/web/20180503082039id_/https://twitter.com/twitter?lang=it — title="Retweet" on js-actionRetweet button |
| it | undoRepostAction | 2014 | Annulla Retweet | https://web.archive.org/web/20150531164552id_/https://twitter.com/twitter?lang=it — title="Annulla Retweet" on ProfileTweet-actionButtonUndo (retweet) |
| it | undoRepostAction | 2017 | Annulla Retweet | https://web.archive.org/web/20180503082039id_/https://twitter.com/twitter?lang=it — title="Annulla Retweet" on ProfileTweet-actionButtonUndo (retweet) |
| it | quoteAction | 2014 | Cita Tweet | https://web.archive.org/web/20151113221317id_/https://abs.twimg.com/c/swift/it/bundle/boot.c5789241c3ddc2e50f4a0ea0d0b64bffa3840f72.js — uiDialogUpdateTitle title when retweeting with comment: "Cita Tweet" (dialog title; no menu item existed) |
| it | quoteAction | 2017 | Ritwitta e commenta | https://web.archive.org/web/20181210141709id_/https://abs.twimg.com/responsive-web/web/i18n/it.f8af8f4b1cac67e5.js — key dcaee2df (English "Retweet with comment" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Ritwitta e commenta" |
| it | repostsLabel | 2014 | Retweet | https://web.archive.org/web/20150816071402id_/https://twitter.com/jack/status/20?lang=it — permalink stat label after <strong>count</strong>: "Retweet" |
| it | repostsLabel | 2017 | Retweet | https://web.archive.org/web/20180413045811id_/https://twitter.com/jack/status/20?lang=it — permalink stat label: "Retweet" |
| it | likesLabel | 2014 | Preferiti | https://web.archive.org/web/20150531164552id_/https://twitter.com/twitter?lang=it — ProfileNav-label "Preferiti" |
| it | likesLabel | 2017 | Mi piace | https://web.archive.org/web/20180503082039id_/https://twitter.com/twitter?lang=it — ProfileNav-label "Mi piace" |
| it | profilePostsTab | 2014 | Tweet | https://web.archive.org/web/20150531164552id_/https://twitter.com/twitter?lang=it — first ProfileNav-label "Tweet" |
| it | profilePostsTab | 2017 | Tweet | https://web.archive.org/web/20180503082039id_/https://twitter.com/twitter?lang=it — first ProfileNav-label "Tweet" |
| ja | composeButton | 2014 | ツイート | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| ja | composeButton | 2017 | ツイート | derived: the composer's "Tweet" button string of the same era (composeSubmit 2017) |
| ja | composeSubmit | 2014 | ツイート | https://web.archive.org/web/20151002060420/https://abs.twimg.com/c/swift/ja/bundle/boot.afd2415d8b7f860049933aa6e53b8c944197020a.js (Hogan template tweet_button, class tweet-btn: t.b("ツイート")) — "ツイート" |
| ja | composeSubmit | 2017 | ツイート | https://web.archive.org/web/20181206224440/https://abs.twimg.com/responsive-web/web/i18n/ja.b8eff5e35053a302.js (id c6432564 "Tweet" -> "ツイート"; usage context in app code not verified) — "ツイート" |
| ja | repostAction | 2014 | リツイート | https://web.archive.org/web/20151002060420/https://twitter.com/twitter?lang=ja (title attr / u-hiddenVisually on tweet action) — "リツイート" |
| ja | repostAction | 2017 | リツイート | https://web.archive.org/web/20180111122149/https://twitter.com/twitter?lang=ja (title attr / u-hiddenVisually on tweet action) — "リツイート" |
| ja | undoRepostAction | 2014 | リツイートを取り消す | https://web.archive.org/web/20151002060420/https://twitter.com/twitter?lang=ja (title attr of retweeted action) — "リツイートを取り消す" |
| ja | undoRepostAction | 2017 | リツイートを取り消す | https://web.archive.org/web/20181206224440/https://abs.twimg.com/responsive-web/web/i18n/ja.b8eff5e35053a302.js (id e9a6d146 "Undo Retweet"); legacy page https://web.archive.org/web/20180111122149/https://twitter.com/twitter?lang=ja has title="リツイートを取り消す" |
| ja | quoteAction | 2014 | 引用ツイート | https://web.archive.org/web/20151002060420/https://abs.twimg.com/c/swift/ja/bundle/boot.afd2415d8b7f860049933aa6e53b8c944197020a.js (_() string "Quote Tweet" = title of retweet-with-comment dialog; not a menu item label) — "引用ツイート" |
| ja | quoteAction | 2017 | コメントを付けてリツイート | https://web.archive.org/web/20181206224440/https://abs.twimg.com/responsive-web/web/i18n/ja.b8eff5e35053a302.js (id dcaee2df "Retweet with comment") — "コメントを付けてリツイート" |
| ja | repostsLabel | 2014 | リツイート | https://web.archive.org/web/20150320162759/https://twitter.com/jack/status/20?lang=ja (permalink stat js-stat-retweets) — "リツイート" |
| ja | repostsLabel | 2017 | リツイート | https://web.archive.org/web/20181206224440/https://abs.twimg.com/responsive-web/web/i18n/ja.b8eff5e35053a302.js (id a9d61ca2 count label function, plural); legacy permalink https://web.archive.org/web/20181218114423/https://twitter.com/jack/status/20?lang=ja shows "件のリツイート" |
| ja | likesLabel | 2014 | お気に入り | https://web.archive.org/web/20150320162759/https://twitter.com/jack/status/20?lang=ja (permalink stat js-stat-favorites); also profile tab https://web.archive.org/web/20151002060420/https://twitter.com/twitter?lang=ja — "お気に入り" |
| ja | likesLabel | 2017 | いいね | https://web.archive.org/web/20181206224440/https://abs.twimg.com/responsive-web/web/i18n/ja.b8eff5e35053a302.js (id b51a7d1b count label / fbffbecb tab); legacy profile tab https://web.archive.org/web/20180111122149/https://twitter.com/twitter?lang=ja — "いいね" |
| ja | profilePostsTab | 2014 | ツイート | https://web.archive.org/web/20151002060420/https://twitter.com/twitter?lang=ja (ProfileNav-label) — "ツイート" |
| ja | profilePostsTab | 2017 | ツイート | https://web.archive.org/web/20180111122149/https://twitter.com/twitter?lang=ja (ProfileNav-label) — "ツイート" |
| ko | composeButton | 2014 | 트윗하기 | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| ko | composeButton | 2017 | 트윗 | https://web.archive.org/web/20181207013220id_/https://abs.twimg.com/responsive-web/web/i18n/ko.319355e07291e6cc.js — key c6432564 (English "Tweet" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "트윗" [PWA bundle Dec 2018; role as nav compose button inferred] |
| ko | composeSubmit | 2014 | 트윗하기 | https://web.archive.org/web/20151113221727id_/https://abs.twimg.com/c/swift/ko/bundle/boot.6fdf280680ce2a70c27a55801a2181b314655d2d.js — tweet_button template, default text "트윗하기" |
| ko | composeSubmit | 2017 | 트윗하기 | https://web.archive.org/web/20180503082046id_/https://abs.twimg.com/k/ko/0.commons.ko.adf37c44b0e6c2bbcf75.js — replyButtonTextSelector.text("트윗하기") (legacy composer button text, Tweet vs Reply) |
| ko | repostAction | 2014 | 리트윗 | https://web.archive.org/web/20150531164557id_/https://twitter.com/twitter?lang=ko — title="리트윗" on js-actionRetweet button |
| ko | repostAction | 2017 | 리트윗 | https://web.archive.org/web/20180503082046id_/https://twitter.com/twitter?lang=ko — title="리트윗" on js-actionRetweet button |
| ko | undoRepostAction | 2014 | 리트윗 취소 | https://web.archive.org/web/20150531164557id_/https://twitter.com/twitter?lang=ko — title="리트윗 취소" on ProfileTweet-actionButtonUndo (retweet) |
| ko | undoRepostAction | 2017 | 리트윗 취소 | https://web.archive.org/web/20180503082046id_/https://twitter.com/twitter?lang=ko — title="리트윗 취소" on ProfileTweet-actionButtonUndo (retweet) |
| ko | quoteAction | 2014 | 트윗 인용하기 | https://web.archive.org/web/20151113221727id_/https://abs.twimg.com/c/swift/ko/bundle/boot.6fdf280680ce2a70c27a55801a2181b314655d2d.js — uiDialogUpdateTitle title when retweeting with comment: "트윗 인용하기" (dialog title; no menu item existed) |
| ko | quoteAction | 2017 | 의견을 덧붙여서 리트윗하기 | https://web.archive.org/web/20181207013220id_/https://abs.twimg.com/responsive-web/web/i18n/ko.319355e07291e6cc.js — key dcaee2df (English "Retweet with comment" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "의견을 덧붙여서 리트윗하기" |
| ko | repostsLabel | 2014 | 리트윗 | https://web.archive.org/web/20150816041858id_/https://twitter.com/jack/status/20?lang=ko — permalink stat label after <strong>count</strong>: "리트윗" |
| ko | repostsLabel | 2017 | 리트윗 | https://web.archive.org/web/20180413045817id_/https://twitter.com/jack/status/20?lang=ko — permalink stat label: "리트윗" |
| ko | likesLabel | 2014 | 관심글 | https://web.archive.org/web/20150531164557id_/https://twitter.com/twitter?lang=ko — ProfileNav-label "관심글" |
| ko | likesLabel | 2017 | 마음에 들어요 | https://web.archive.org/web/20180503082046id_/https://twitter.com/twitter?lang=ko — ProfileNav-label "마음에 들어요" |
| ko | profilePostsTab | 2014 | 트윗 | https://web.archive.org/web/20150531164557id_/https://twitter.com/twitter?lang=ko — first ProfileNav-label "트윗" |
| ko | profilePostsTab | 2017 | 트윗 | https://web.archive.org/web/20180503082046id_/https://twitter.com/twitter?lang=ko — first ProfileNav-label "트윗" |
| pt | composeButton | 2014 | Tweetar | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| pt | composeButton | 2017 | Tweet | derived: the composer's "Tweet" button string of the same era (composeSubmit 2017) |
| pt | composeSubmit | 2014 | Tweetar | https://web.archive.org/web/20151002060428/https://abs.twimg.com/c/swift/pt/bundle/boot.012e65babfe59538a86e13c6929be98e2f91850a.js (Hogan template tweet_button, class tweet-btn: t.b("Tweetar")) — "Tweetar" |
| pt | composeSubmit | 2017 | Tweet | https://web.archive.org/web/20181208141905/https://abs.twimg.com/responsive-web/web/i18n/pt.0d9c45b9d3b2bd3b.js (id c6432564 "Tweet" -> "Tweet"; usage context in app code not verified) — "Tweet" |
| pt | repostAction | 2014 | Retweetar | https://web.archive.org/web/20151002060428/https://twitter.com/twitter?lang=pt (title attr / u-hiddenVisually on tweet action) — "Retweetar" |
| pt | repostAction | 2017 | Retweetar | https://web.archive.org/web/20180111122159/https://twitter.com/twitter?lang=pt (title attr / u-hiddenVisually on tweet action) — "Retweetar" |
| pt | undoRepostAction | 2014 | Desfazer retweet | https://web.archive.org/web/20151002060428/https://twitter.com/twitter?lang=pt (title attr of retweeted action) — "Desfazer retweet" |
| pt | undoRepostAction | 2017 | Desfazer Retweet | https://web.archive.org/web/20181208141905/https://abs.twimg.com/responsive-web/web/i18n/pt.0d9c45b9d3b2bd3b.js (id e9a6d146 "Undo Retweet"); legacy page https://web.archive.org/web/20180111122159/https://twitter.com/twitter?lang=pt has title="Desfazer retweet" |
| pt | quoteAction | 2014 | Comentar Tweet | https://web.archive.org/web/20151002060428/https://abs.twimg.com/c/swift/pt/bundle/boot.012e65babfe59538a86e13c6929be98e2f91850a.js (_() string "Quote Tweet" = title of retweet-with-comment dialog; not a menu item label) — "Comentar Tweet" |
| pt | quoteAction | 2017 | Retweetar com comentário | https://web.archive.org/web/20181208141905/https://abs.twimg.com/responsive-web/web/i18n/pt.0d9c45b9d3b2bd3b.js (id dcaee2df "Retweet with comment") — "Retweetar com comentário" |
| pt | repostsLabel | 2014 | Retweets | https://web.archive.org/web/20150320162810/https://twitter.com/jack/status/20?lang=pt (permalink stat js-stat-retweets) — "Retweets" |
| pt | repostsLabel | 2017 | Retweets | https://web.archive.org/web/20181208141905/https://abs.twimg.com/responsive-web/web/i18n/pt.0d9c45b9d3b2bd3b.js (id a9d61ca2 count label function, plural) — "Retweets" |
| pt | likesLabel | 2014 | Curtiu | https://web.archive.org/web/20151002060428/https://twitter.com/twitter?lang=pt (ProfileNav-label tab) — "Curtiu" ; NOTE permalink stat label in 2015 pt was "Curtiram" (https://web.archive.org/web/20150320162810/https://twitter.com/jack/status/20?lang=pt) |
| pt | likesLabel | 2017 | Curtidas | https://web.archive.org/web/20181208141905/https://abs.twimg.com/responsive-web/web/i18n/pt.0d9c45b9d3b2bd3b.js (id b51a7d1b count label / fbffbecb tab); legacy profile tab https://web.archive.org/web/20180111122159/https://twitter.com/twitter?lang=pt — "Curtidas" |
| pt | profilePostsTab | 2014 | Tweets | https://web.archive.org/web/20151002060428/https://twitter.com/twitter?lang=pt (ProfileNav-label) — "Tweets" |
| pt | profilePostsTab | 2017 | Tweets | https://web.archive.org/web/20180111122159/https://twitter.com/twitter?lang=pt (ProfileNav-label) — "Tweets" |
| ru | composeButton | 2014 | Твитнуть | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| ru | composeButton | 2017 | Твитнуть | https://web.archive.org/web/20181208063416id_/https://abs.twimg.com/responsive-web/web/i18n/ru.122aa5d1423be4cc.js — key c6432564 (English "Tweet" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Твитнуть" [PWA bundle Dec 2018; role as nav compose button inferred] |
| ru | composeSubmit | 2014 | Твитнуть | https://web.archive.org/web/20151113225613id_/https://abs.twimg.com/c/swift/ru/bundle/boot.1f6f92016c7fea32349cdc752ef96bef62174ea6.js — tweet_button template, default text "Твитнуть" |
| ru | composeSubmit | 2017 | Твитнуть | https://web.archive.org/web/20180503082050id_/https://abs.twimg.com/k/ru/0.commons.ru.1db8772757bc0d9453cf.js — replyButtonTextSelector.text("Твитнуть") (legacy composer button text, Tweet vs Reply) |
| ru | repostAction | 2014 | Ретвитнуть | https://web.archive.org/web/20150531164600id_/https://twitter.com/twitter?lang=ru — title="Ретвитнуть" on js-actionRetweet button |
| ru | repostAction | 2017 | Ретвитнуть | https://web.archive.org/web/20180503082050id_/https://twitter.com/twitter?lang=ru — title="Ретвитнуть" on js-actionRetweet button |
| ru | undoRepostAction | 2014 | Отменить ретвит | https://web.archive.org/web/20150531164600id_/https://twitter.com/twitter?lang=ru — title="Отменить ретвит" on ProfileTweet-actionButtonUndo (retweet) |
| ru | undoRepostAction | 2017 | Отменить ретвит | https://web.archive.org/web/20180503082050id_/https://twitter.com/twitter?lang=ru — title="Отменить ретвит" on ProfileTweet-actionButtonUndo (retweet) |
| ru | quoteAction | 2014 | Цитировать | https://web.archive.org/web/20151113225613id_/https://abs.twimg.com/c/swift/ru/bundle/boot.1f6f92016c7fea32349cdc752ef96bef62174ea6.js — uiDialogUpdateTitle title when retweeting with comment: "Цитировать" (dialog title; no menu item existed) |
| ru | quoteAction | 2017 | Ретвитнуть с комментарием | https://web.archive.org/web/20181208063416id_/https://abs.twimg.com/responsive-web/web/i18n/ru.122aa5d1423be4cc.js — key dcaee2df (English "Retweet with comment" in https://web.archive.org/web/20181207194333id_/https://abs.twimg.com/responsive-web/web/i18n/en.3bc202ddcff0dcda.js) = "Ретвитнуть с комментарием" |
| ru | likesLabel | 2014 | Избранное | https://web.archive.org/web/20150531164600id_/https://twitter.com/twitter?lang=ru — ProfileNav-label "Избранное" |
| ru | likesLabel | 2017 | Нравится | https://web.archive.org/web/20180503082050id_/https://twitter.com/twitter?lang=ru — ProfileNav-label "Нравится" |
| ru | profilePostsTab | 2014 | Твиты | https://web.archive.org/web/20150531164600id_/https://twitter.com/twitter?lang=ru — first ProfileNav-label "Твиты" |
| ru | profilePostsTab | 2017 | Твиты | https://web.archive.org/web/20180503082050id_/https://twitter.com/twitter?lang=ru — first ProfileNav-label "Твиты" |
| tr | composeButton | 2014 | Tweetle | derived: the composer's "Tweet" button string of the same era (composeSubmit 2014) |
| tr | composeButton | 2017 | Tweetle | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key c6432564 (English "Tweet" in same-era en bundle) = "Tweetle" |
| tr | composeSubmit | 2014 | Tweetle | https://web.archive.org/web/20150320162813/https://twitter.com/jack/status/20?lang=tr — retweet/quote dialog button span.RetweetDialog-tweetActionLabel: "Tweetle" (indirect: submit label of dialog when comment added) |
| tr | composeSubmit | 2017 | Tweetle | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key c6432564 = "Tweetle" |
| tr | repostAction | 2014 | Retweetle | https://web.archive.org/web/20150320162813/https://twitter.com/jack/status/20?lang=tr — title="Retweetle" data-modal="ProfileTweet-retweet" |
| tr | repostAction | 2017 | Retweet | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key ce6d3a76 (English "Retweet") = "Retweet" |
| tr | undoRepostAction | 2014 | Retweeti geri al | https://web.archive.org/web/20150320162813/https://twitter.com/jack/status/20?lang=tr — ProfileTweet-actionButtonUndo title="Retweeti geri al" |
| tr | undoRepostAction | 2017 | Retweeti Geri Al | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key e9a6d146 (English "Undo Retweet") = "Retweeti Geri Al" |
| tr | quoteAction | 2017 | Yorumla birlikte Retweetle | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key dcaee2df (English "Retweet with comment") = "Yorumla birlikte Retweetle" |
| tr | repostsLabel | 2014 | Retweet | https://web.archive.org/web/20150320162813/https://twitter.com/jack/status/20?lang=tr — li.js-stat-retweets label: "Retweet" |
| tr | repostsLabel | 2017 | Retweet | https://web.archive.org/web/20181218114447/https://twitter.com/jack/status/20?lang=tr — li.js-stat-retweets label: "Retweet"; https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js key a9d61ca2 |
| tr | likesLabel | 2014 | Favoriler | https://web.archive.org/web/20150601184806/https://twitter.com/twitter?lang=tr — ProfileNav-label (favorites tab): "Favoriler" |
| tr | likesLabel | 2017 | Beğeni | https://web.archive.org/web/20181208124844js_/https://abs.twimg.com/responsive-web/web/i18n/tr.208078c02ec72963.js — key fbffbecb (English "Likes") = "Beğeni"; profile tab at https://web.archive.org/web/20180601194914/https://twitter.com/twitter?lang=tr agrees |
| tr | profilePostsTab | 2014 | Tweetler | https://web.archive.org/web/20150601184806/https://twitter.com/twitter?lang=tr — ProfileNav-label (tweets tab): "Tweetler" |
| tr | profilePostsTab | 2017 | Tweetler | https://web.archive.org/web/20180601194914/https://twitter.com/twitter?lang=tr — ProfileNav-label (tweets tab): "Tweetler" |
